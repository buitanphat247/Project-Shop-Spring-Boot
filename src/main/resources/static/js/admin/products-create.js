$(document).ready(function() {
    console.log('Product create page loaded');
    
    let attributeCount = 0;
    let isSubmitting = false; // Flag to prevent multiple submissions
    
    // Load categories on page load
    loadCategories();
    
    // Add default attribute on page load
    addNewAttribute();
    
    // Initialize image upload
    initImageUpload();
    
    // Add attribute button click
    $('#addAttributeBtn').click(function(e) {
        e.preventDefault();
        console.log('Add attribute button clicked');
        addNewAttribute();
    });
    
    // Remove attribute button click (delegated event)
    $(document).on('click', '.remove-attribute-btn', function(e) {
        e.preventDefault();
        console.log('Remove attribute button clicked');
        const $attributeItem = $(this).closest('.attribute-item');
        removeAttribute($attributeItem);
    });
    
    // Form submit
    $('form').submit(function(e) {
        e.preventDefault();
        console.log('Form submitted');
        handleFormSubmit();
    });
    
    // Add new attribute function
    function addNewAttribute() {
        const $template = $('#attributeTemplate');
        const $container = $('#attributesContainer');
        
        // Clone the template (which is now inside the container)
        const $newAttribute = $template.clone().removeClass('hidden');
        
        // Add unique IDs to inputs
        attributeCount++;
        const keyId = 'attr_key_' + attributeCount;
        const valueId = 'attr_value_' + attributeCount;
        
        $newAttribute.find('input').first().attr('id', keyId).attr('name', 'attributes[' + attributeCount + '].key');
        $newAttribute.find('input').last().attr('id', valueId).attr('name', 'attributes[' + attributeCount + '].value');
        
        // Add to container with animation (after the template)
        $template.after($newAttribute);
        
        // Don't auto focus on first input
        // $newAttribute.find('input').first().focus();
        
        console.log('New attribute added, count:', attributeCount);
    }
    
    // Remove attribute function
    function removeAttribute($attributeItem) {
        console.log('Removing attribute');
        
        // Add removing class for animation
        $attributeItem.addClass('removing');
        
        // Remove after animation
        setTimeout(function() {
            $attributeItem.remove();
            console.log('Attribute removed');
        }, 300);
    }
    
    // Handle form submit
    function handleFormSubmit() {
        console.log('Handling form submit');
        
        // Check if already submitting
        if (isSubmitting) {
            console.log('Form is already being submitted, ignoring...');
            return;
        }
        
        // Set submitting flag
        isSubmitting = true;
        console.log('Setting isSubmitting to true');
        
        // Disable submit button and show loading state
        const $submitBtn = $('#saveProductBtn');
        const originalText = $submitBtn.html();
        $submitBtn.prop('disabled', true);
        $submitBtn.html('<i class="fas fa-spinner fa-spin mr-2"></i>Đang tạo sản phẩm...');
        $submitBtn.removeClass('hover:bg-blue-700').addClass('bg-blue-400 cursor-not-allowed');
        
        // Collect form data
        const formData = {
            name: $('input[placeholder="Nhập tên sản phẩm"]').val(),
            price: parseFloat($('input[placeholder="Nhập giá sản phẩm"]').val()),
            stock: parseInt($('input[placeholder="Nhập số lượng"]').val()),
            description: $('textarea[placeholder="Nhập mô tả sản phẩm"]').val(),
            categoryId: $('#categorySelect').val(),
            attributes: []
        };
        
        // Collect attributes
        $('.attribute-item').each(function() {
            const $item = $(this);
            const key = $item.find('input').first().val().trim();
            const value = $item.find('input').last().val().trim();
            
            if (key && value) {
                formData.attributes.push({
                    key: key,
                    value: value
                });
            }
        });
        
        // Add images to form data
        const imageFiles = Array.from($('#imageInput')[0].files);
        formData.images = imageFiles.map(file => ({
            name: file.name,
            size: file.size,
            type: file.type,
            lastModified: file.lastModified,
            file: file // Include the actual file object
        }));
        
        // Also add raw files array for easier access
        formData.imageFiles = imageFiles;
        
        console.log('=== FORM SUBMIT DATA ===');
        console.log('Raw form data:', formData);
        console.log('JSON formatted (without files):');
        
        // Create a copy without file objects for JSON display
        const jsonData = {
            name: formData.name,
            price: formData.price,
            stock: formData.stock,
            description: formData.description,
            categoryId: formData.categoryId,
            attributes: formData.attributes,
            images: formData.images.map(img => ({
                name: img.name,
                size: img.size,
                type: img.type,
                lastModified: img.lastModified
            }))
        };
        
        console.log(JSON.stringify(jsonData, null, 2));
        console.log('Image files count:', imageFiles.length);
        console.log('Image files:', imageFiles);
        console.log('========================');
        
        // Start the save process
        saveProduct(formData);
    }
    
    // Save product with full flow
    async function saveProduct(formData) {
        try {
            console.log('🚀 Starting product save process...');
            
            // Step 1: Create product
            console.log('📦 Step 1: Creating product...');
            const productData = {
                name: formData.name,
                description: formData.description,
                price: formData.price,
                stock: formData.stock,
                categoryId: formData.categoryId
            };
            
            const productResponse = await $.ajax({
                url: '/api/products',
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(productData)
            });
            
            if (!productResponse.success) {
                throw new Error(productResponse.message || 'Failed to create product');
            }
            
            const productId = productResponse.data.id;
            console.log('✅ Product created successfully:', productId);
            
            // Step 2: Save attributes
            if (formData.attributes && formData.attributes.length > 0) {
                console.log('🏷️ Step 2: Saving attributes...');
                for (const attribute of formData.attributes) {
                    try {
                        const attributeData = {
                            productId: productId,
                            name: attribute.key,
                            value: attribute.value
                        };
                        
                        const attributeResponse = await $.ajax({
                            url: '/api/product-attributes',
                            method: 'POST',
                            contentType: 'application/json',
                            data: JSON.stringify(attributeData)
                        });
                        
                        if (attributeResponse.success) {
                            console.log('✅ Attribute saved:', attribute.key, '=', attribute.value);
                        } else {
                            console.warn('⚠️ Failed to save attribute:', attribute.key, attributeResponse.message);
                        }
                    } catch (error) {
                        console.error('❌ Error saving attribute:', attribute.key, error);
                    }
                }
            }
            
            // Step 3: Upload images and save to database
            if (formData.imageFiles && formData.imageFiles.length > 0) {
                console.log('🖼️ Step 3: Uploading images...');
                for (let i = 0; i < formData.imageFiles.length; i++) {
                    try {
                        const file = formData.imageFiles[i];
                        console.log(`Uploading image ${i + 1}/${formData.imageFiles.length}:`, file.name);
                        
                        // Upload to Cloudinary
                        const formDataUpload = new FormData();
                        formDataUpload.append('image', file);
                        
                        const uploadResponse = await $.ajax({
                            url: '/api/cloudinary',
                            method: 'POST',
                            data: formDataUpload,
                            processData: false,
                            contentType: false
                        });
                        
                        console.log('Cloudinary response:', uploadResponse);
                        
                        // CloudinaryController now returns ApiResponse format
                        if (uploadResponse.success && uploadResponse.data && uploadResponse.data.url) {
                            // Save image URL to database
                            const imageData = {
                                productId: productId,
                                imageUrl: uploadResponse.data.url
                            };
                            
                            const imageResponse = await $.ajax({
                                url: '/api/product-images',
                                method: 'POST',
                                contentType: 'application/json',
                                data: JSON.stringify(imageData)
                            });
                            
                            if (imageResponse.success) {
                                console.log('✅ Image saved:', uploadResponse.data.url);
                            } else {
                                console.warn('⚠️ Failed to save image to database:', imageResponse.message);
                            }
                        } else {
                            console.warn('⚠️ Failed to upload image:', uploadResponse.message);
                        }
                    } catch (error) {
                        console.error('❌ Error uploading image:', error);
                    }
                }
            }
            
            // Success!
            console.log('🎉 Product save process completed!');
            showToast('Sản phẩm đã được tạo thành công!', 'success');
            
            // Reset form
            resetForm();
            
        } catch (error) {
            console.error('❌ Error in save process:', error);
            showToast('Lỗi khi tạo sản phẩm: ' + (error.message || 'Lỗi không xác định'), 'error');
        } finally {
            // Always reset the submitting flag and button state
            resetSubmitButton();
        }
    }
    
    // Reset submit button state
    function resetSubmitButton() {
        console.log('Resetting submit button state');
        isSubmitting = false;
        
        const $submitBtn = $('#saveProductBtn');
        $submitBtn.prop('disabled', false);
        $submitBtn.html('<i class="fas fa-save mr-2"></i>Lưu sản phẩm');
        $submitBtn.removeClass('bg-blue-400 cursor-not-allowed').addClass('hover:bg-blue-700');
    }
    
    // Reset form after successful save
    function resetForm() {
        // Reset all form fields
        $('input[type="text"], input[type="number"], textarea').val('');
        $('#categorySelect').val('');
        
        // Clear attributes
        $('#attributesContainer').empty();
        attributeCount = 0;
        addNewAttribute(); // Add default attribute
        
        // Clear images
        $('#imageInput').val('');
        $('#imagePreviewContainer').addClass('hidden');
        $('#imagePreviewGrid').empty();
        
        console.log('Form reset completed');
    }
    
    // Load categories from API
    function loadCategories() {
        console.log('Loading categories...');
        
        try {
            $.ajax({
                url: '/api/categories',
                method: 'GET',
                success: function(result) {
                    console.log('Categories loaded:', result);
                    
                    if (result.success && result.data && result.data.items && result.data.items.length > 0) {
                        console.log('Displaying categories with count:', result.data.items.length);
                        displayCategories(result.data.items);
                    } else {
                        console.log('No categories found');
                        showCategoriesError();
                    }
                },
                error: function(xhr, status, error) {
                    console.error('Error loading categories:', error);
                    showCategoriesError();
                }
            });
        } catch (error) {
            console.error('Error in loadCategories:', error);
            showCategoriesError();
        }
    }
    
    // Display categories in select dropdown
    function displayCategories(categories) {
        console.log('Displaying categories:', categories);
        
        const $select = $('#categorySelect');
        let html = '<option value="">Chọn danh mục</option>';
        
        categories.forEach(function(category) {
            html += `<option value="${category.id}">${category.name}</option>`;
        });
        
        $select.html(html);
        console.log('Categories loaded into select dropdown');
    }
    
    // Show categories error
    function showCategoriesError() {
        const $select = $('#categorySelect');
        $select.html('<option value="">Không thể tải danh mục</option>');
        $select.prop('disabled', true);
    }
    
    // Initialize image upload functionality
    function initImageUpload() {
        const $imageInput = $('#imageInput');
        const $previewContainer = $('#imagePreviewContainer');
        const $previewGrid = $('#imagePreviewGrid');
        const $clearAllBtn = $('#clearAllImages');
        
        let selectedFiles = [];
        
        // File input change
        $imageInput.change(function(e) {
            const files = Array.from(e.target.files);
            handleFiles(files);
        });
        
        // Clear all images
        $clearAllBtn.click(function() {
            selectedFiles = [];
            $imageInput.val('');
            $previewContainer.addClass('hidden');
            $previewGrid.empty();
            console.log('All images cleared');
        });
        
        // Handle selected files
        function handleFiles(files) {
            console.log('Files selected:', files.length);
            
            // Filter only image files
            const imageFiles = files.filter(file => file.type.startsWith('image/'));
            
            if (imageFiles.length === 0) {
                showToast('Vui lòng chọn file hình ảnh hợp lệ!', 'error');
                return;
            }
            
            // Always replace selected files with new ones (prevent accumulation)
            selectedFiles = imageFiles;
            console.log('Replacing files with new selection');
            
            // Update file input
            const dt = new DataTransfer();
            selectedFiles.forEach(file => dt.items.add(file));
            $imageInput[0].files = dt.files;
            
            // Show previews
            showImagePreviews();
            
            console.log('Total selected files:', selectedFiles.length);
        }
        
        // Show image previews
        function showImagePreviews() {
            $previewGrid.empty();
            
            // Update image count
            $('#imageCount').text(selectedFiles.length);
            
            selectedFiles.forEach((file, index) => {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const fileSize = (file.size / 1024 / 1024).toFixed(1);
                    const previewHtml = `
                        <div class="relative group bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200">
                            <div class="aspect-square relative">
                                <img src="${e.target.result}" alt="Preview ${index + 1}" 
                                     class="w-full h-full object-cover">
                                <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200"></div>
                                <button type="button" class="remove-image-btn absolute top-2 right-2 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-xs hover:bg-red-600 transition-all duration-200 opacity-0 group-hover:opacity-100 shadow-lg" 
                                        data-index="${index}">
                                    <i class="fas fa-times"></i>
                                </button>
                                <div class="absolute bottom-2 left-2 right-2">
                                    <div class="bg-white bg-opacity-90 backdrop-blur-sm rounded-lg px-2 py-1">
                                        <div class="text-xs font-medium text-gray-800 truncate">${file.name}</div>
                                        <div class="text-xs text-gray-500">${fileSize} MB</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                    $previewGrid.append(previewHtml);
                };
                reader.readAsDataURL(file);
            });
            
            $previewContainer.removeClass('hidden');
        }
        
        // Remove individual image
        $(document).on('click', '.remove-image-btn', function() {
            const index = parseInt($(this).data('index'));
            selectedFiles.splice(index, 1);
            
            // Update file input
            const dt = new DataTransfer();
            selectedFiles.forEach(file => dt.items.add(file));
            $imageInput[0].files = dt.files;
            
            if (selectedFiles.length === 0) {
                $previewContainer.addClass('hidden');
            } else {
                showImagePreviews();
            }
            
            console.log('Image removed, remaining:', selectedFiles.length);
        });
    }
    
    // Show toast notification
    function showToast(message, type = 'success') {
        const toastId = 'toast-' + Date.now();
        const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500';
        const icon = type === 'success' ? 'fas fa-check' : type === 'error' ? 'fas fa-times' : 'fas fa-info';
        
        const toastHtml = `
            <div id="${toastId}" class="fixed top-4 right-4 ${bgColor} text-white px-4 py-3 rounded-lg shadow-lg z-50 transform translate-x-full transition-all duration-300 max-w-sm">
                <div class="flex items-center">
                    <i class="${icon} mr-2 flex-shrink-0"></i>
                    <span class="text-sm">${message}</span>
                </div>
            </div>
        `;
        
        $('body').append(toastHtml);
        
        // Show toast immediately
        setTimeout(() => {
            $(`#${toastId}`).removeClass('translate-x-full');
        }, 50);
        
        // Hide toast after 2.5 seconds
        setTimeout(() => {
            $(`#${toastId}`).addClass('translate-x-full');
            setTimeout(() => {
                $(`#${toastId}`).remove();
            }, 300);
        }, 2500);
    }
});

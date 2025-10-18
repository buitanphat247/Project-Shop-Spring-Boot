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
        const $container = $('#attributesContainer');
        
        // Create new attribute HTML directly
        attributeCount++;
        const keyId = 'attr_key_' + attributeCount;
        const valueId = 'attr_value_' + attributeCount;
        
        const newAttributeHtml = `
            <div class="attribute-item flex items-center space-x-3 p-4 border border-gray-200 rounded-lg bg-white">
                <div class="flex-1">
                    <input
                        type="text"
                        id="${keyId}"
                        name="attributes[${attributeCount}].key"
                        placeholder="Tên thuộc tính (VD: Màu sắc, Kích thước, Chất liệu...)"
                        class="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:border-blue-500 focus:outline-none transition-colors text-sm no-scale"
                    />
                </div>
                <div class="flex-1">
                    <input
                        type="text"
                        id="${valueId}"
                        name="attributes[${attributeCount}].value"
                        placeholder="Giá trị (VD: Đỏ, XL, Cotton...)"
                        class="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:border-blue-500 focus:outline-none transition-colors text-sm no-scale"
                    />
                </div>
                <button type="button" class="remove-attribute-btn px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        
        // Add to container
        $container.append(newAttributeHtml);
        
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
        
        // Disable all form elements
        disableAllFormElements();
        
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
            
            // Step 3: Upload images with progress tracking
            if (formData.imageFiles && formData.imageFiles.length > 0) {
                console.log('🖼️ Step 3: Uploading images with progress...');
                await uploadImagesWithProgress(formData.imageFiles, productId);
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
    
    // Disable all form elements during submission
    function disableAllFormElements() {
        console.log('Disabling all form elements');
        
        // Disable all inputs
        $('input[type="text"], input[type="number"], textarea, select').prop('disabled', true);
        
        // Disable image upload
        $('#imageInput').prop('disabled', true);
        
        // Disable add attribute button
        $('#addAttributeBtn').prop('disabled', true).addClass('opacity-50 cursor-not-allowed');
        
        // Disable all remove attribute buttons
        $('.remove-attribute-btn').prop('disabled', true).addClass('opacity-50 cursor-not-allowed');
        
        // Disable clear all images button
        $('#clearAllImages').prop('disabled', true).addClass('opacity-50 cursor-not-allowed');
        
        // Disable cancel button
        $('button[type="button"]:not(#saveProductBtn)').prop('disabled', true).addClass('opacity-50 cursor-not-allowed');
        
        console.log('All form elements disabled');
    }
    
    // Enable all form elements after submission
    function enableAllFormElements() {
        console.log('Enabling all form elements');
        
        // Enable all inputs
        $('input[type="text"], input[type="number"], textarea, select').prop('disabled', false);
        
        // Enable image upload
        $('#imageInput').prop('disabled', false);
        
        // Enable add attribute button
        $('#addAttributeBtn').prop('disabled', false).removeClass('opacity-50 cursor-not-allowed');
        
        // Enable all remove attribute buttons
        $('.remove-attribute-btn').prop('disabled', false).removeClass('opacity-50 cursor-not-allowed');
        
        // Enable clear all images button
        $('#clearAllImages').prop('disabled', false).removeClass('opacity-50 cursor-not-allowed');
        
        // Enable cancel button
        $('button[type="button"]:not(#saveProductBtn)').prop('disabled', false).removeClass('opacity-50 cursor-not-allowed');
        
        console.log('All form elements enabled');
    }
    
    // Reset submit button state
    function resetSubmitButton() {
        console.log('Resetting submit button state');
        isSubmitting = false;
        
        // Enable all form elements
        enableAllFormElements();
        
        const $submitBtn = $('#saveProductBtn');
        $submitBtn.prop('disabled', false);
        $submitBtn.html('<i class="fas fa-save mr-2"></i>Lưu sản phẩm');
        $submitBtn.removeClass('bg-blue-400 cursor-not-allowed').addClass('hover:bg-blue-700');
    }
    
    // Reset form after successful save
    function resetForm() {
        console.log('Starting form reset...');
        
        // Reset all form fields
        $('input[type="text"], input[type="number"], textarea').val('');
        $('#categorySelect').val('');
        
        // Clear ALL attributes including template
        $('.attribute-item').remove();
        attributeCount = 0;
        
        // Clear images
        $('#imageInput').val('');
        $('#imagePreviewContainer').addClass('hidden');
        $('#imagePreviewGrid').empty();
        
        // Add default attribute after a short delay to ensure DOM is ready
        setTimeout(() => {
            addNewAttribute(); // Add default attribute
            console.log('Default attribute added after reset, count:', attributeCount);
        }, 100);
        
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
    
    // Upload images with progress tracking
    async function uploadImagesWithProgress(files, productId) {
        console.log(`🚀 [UPLOAD PROGRESS] Starting upload of ${files.length} images`);
        
        // Add progress bars to each image preview
        addProgressBarsToImages(files.length);
        
        const results = [];
        
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            console.log(`📤 [UPLOAD PROGRESS] Uploading image ${i + 1}/${files.length}: ${file.name}`);
            
            try {
                // Update image status to uploading
                updateImageStatus(i, 'uploading', 'Đang upload...');
                
                // Upload with progress tracking
                const result = await uploadSingleImageWithProgress(file, i, (percent, loaded, total) => {
                    updateImageProgress(i, percent, loaded, total);
                });
                
                if (result.success) {
                    // Save to database
                    const imageData = {
                        productId: productId,
                        imageUrl: result.data.url
                    };
                    
                    const imageResponse = await $.ajax({
                        url: '/api/product-images',
                        method: 'POST',
                        contentType: 'application/json',
                        data: JSON.stringify(imageData)
                    });
                    
                    if (imageResponse.success) {
                        updateImageStatus(i, 'success', 'Upload thành công');
                        results.push(result.data);
                        console.log(`✅ [UPLOAD PROGRESS] Image ${i + 1} uploaded successfully`);
                    } else {
                        updateImageStatus(i, 'error', 'Lỗi lưu database');
                        console.warn(`⚠️ [UPLOAD PROGRESS] Failed to save image ${i + 1} to database:`, imageResponse.message);
                    }
                } else {
                    updateImageStatus(i, 'error', 'Upload thất bại');
                    console.warn(`⚠️ [UPLOAD PROGRESS] Failed to upload image ${i + 1}:`, result.message);
                }
            } catch (error) {
                updateImageStatus(i, 'error', 'Lỗi upload');
                console.error(`❌ [UPLOAD PROGRESS] Error uploading image ${i + 1}:`, error);
            }
        }
        
        console.log(`🎉 [UPLOAD PROGRESS] Upload process completed: ${results.length}/${files.length} successful`);
        return results;
    }
    
    // Upload single image with progress tracking
    function uploadSingleImageWithProgress(file, index, onProgress) {
        return new Promise((resolve, reject) => {
            const formData = new FormData();
            formData.append('image', file);
            
            const xhr = new XMLHttpRequest();
            
            // Track upload progress
            xhr.upload.addEventListener('progress', function(e) {
                if (e.lengthComputable) {
                    const percentComplete = Math.round((e.loaded / e.total) * 100);
                    console.log(`📊 [UPLOAD PROGRESS] Image ${index + 1} progress: ${percentComplete}%`);
                    
                    if (onProgress) {
                        onProgress(percentComplete, e.loaded, e.total);
                    }
                }
            });
            
            // Handle upload completion
            xhr.addEventListener('load', function() {
                if (xhr.status === 200) {
                    try {
                        const response = JSON.parse(xhr.responseText);
                        if (response.success) {
                            resolve(response);
                        } else {
                            reject(new Error(response.message || 'Upload failed'));
                        }
                    } catch (e) {
                        reject(new Error('Parse response error'));
                    }
                } else {
                    reject(new Error(`HTTP error: ${xhr.status}`));
                }
            });
            
            // Handle upload error
            xhr.addEventListener('error', function() {
                reject(new Error('Upload failed'));
            });
            
            // Handle upload timeout
            xhr.addEventListener('timeout', function() {
                reject(new Error('Upload timeout'));
            });
            
            // Configure request
            xhr.open('POST', '/api/cloudinary');
            xhr.timeout = 30000; // 30 seconds timeout
            
            // Start upload
            xhr.send(formData);
        });
    }
    
    // Add progress bars to image previews
    function addProgressBarsToImages(fileCount) {
        console.log(`🎨 [UPLOAD PROGRESS] Adding progress bars to ${fileCount} images`);
        
        const $previewGrid = $('#imagePreviewGrid');
        const $previewItems = $previewGrid.find('.relative.group');
        
        $previewItems.each(function(index) {
            if (index < fileCount) {
                const $item = $(this);
                
                // Add progress overlay
                const progressHtml = `
                    <div class="upload-progress-overlay absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20" style="display: none;">
                        <div class="bg-white rounded-lg p-4 w-32">
                            <div class="text-center mb-2">
                                <i class="fas fa-cloud-upload-alt text-blue-500 text-lg"></i>
                            </div>
                            <div class="text-xs text-gray-600 text-center mb-2 upload-status">Chuẩn bị...</div>
                            <div class="w-full bg-gray-200 rounded-full h-2 mb-2">
                                <div class="upload-progress-bar bg-blue-600 h-2 rounded-full transition-all duration-300" style="width: 0%"></div>
                            </div>
                            <div class="text-xs text-gray-500 text-center upload-percent">0%</div>
                        </div>
                    </div>
                `;
                
                $item.append(progressHtml);
            }
        });
    }
    
    // Update image progress
    function updateImageProgress(index, percent, loaded, total) {
        const $previewItems = $('#imagePreviewGrid').find('.relative.group');
        const $item = $previewItems.eq(index);
        const $overlay = $item.find('.upload-progress-overlay');
        const $progressBar = $item.find('.upload-progress-bar');
        const $percent = $item.find('.upload-percent');
        
        if ($overlay.length) {
            $overlay.show();
            $progressBar.css('width', percent + '%');
            $percent.text(percent + '%');
        }
    }
    
    // Update image status
    function updateImageStatus(index, status, message) {
        const $previewItems = $('#imagePreviewGrid').find('.relative.group');
        const $item = $previewItems.eq(index);
        const $overlay = $item.find('.upload-progress-overlay');
        const $status = $item.find('.upload-status');
        const $progressBar = $item.find('.upload-progress-bar');
        const $percent = $item.find('.upload-percent');
        
        if ($overlay.length) {
            $status.text(message);
            
            if (status === 'success') {
                $progressBar.removeClass('bg-blue-600').addClass('bg-green-600');
                $progressBar.css('width', '100%');
                $percent.text('100%');
                
                // Hide overlay after 2 seconds
                setTimeout(() => {
                    $overlay.fadeOut(500);
                }, 2000);
            } else if (status === 'error') {
                $progressBar.removeClass('bg-blue-600').addClass('bg-red-600');
                $overlay.find('.bg-white').removeClass('bg-white').addClass('bg-red-50');
                $status.removeClass('text-gray-600').addClass('text-red-600');
                
                // Hide overlay after 3 seconds
                setTimeout(() => {
                    $overlay.fadeOut(500);
                }, 3000);
            }
        }
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

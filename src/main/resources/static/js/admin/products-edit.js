// Products Edit JavaScript
$(document).ready(function() {
    console.log('Products Edit page loaded');
    
    // Get product ID from hidden input
    const productId = $('#productId').val();
    if (!productId) {
        console.error('Product ID not found');
        showToast('Không tìm thấy ID sản phẩm', 'error');
        return;
    }
    
    // Load product data
    loadProductData(productId);
    
    // Load categories
    loadCategories();
    
    // Form submit handler
    $('#editProductForm').on('submit', function(e) {
        e.preventDefault();
        updateProduct();
    });
    
    // Cancel button handler
    $('#cancelEdit').on('click', function() {
        if (confirm('Bạn có chắc chắn muốn hủy? Dữ liệu chưa lưu sẽ bị mất.')) {
            window.location.href = '/admin/products';
        }
    });
    
    // File upload handler
    $('#productImage').on('change', function(e) {
        const files = e.target.files;
        if (files.length > 0) {
            uploadNewImages(files);
        }
    });
});

// Load product data
function loadProductData(productId) {
    console.log('Loading product data for ID:', productId);
    
    // Show loading state
    setLoadingState(true);
    
    $.ajax({
        url: `/api/products/${productId}`,
        method: 'GET',
        success: function(response) {
            console.log('Product data loaded:', response);
            
            if (response.success && response.data) {
                const product = response.data;
                populateForm(product);
            } else {
                showToast('Không thể tải dữ liệu sản phẩm', 'error');
            }
        },
        error: function(xhr, status, error) {
            console.error('Error loading product:', error);
            showToast('Lỗi khi tải dữ liệu sản phẩm', 'error');
        },
        complete: function() {
            setLoadingState(false);
        }
    });
}

// Populate form with product data
function populateForm(product) {
    console.log('Populating form with product data:', product);
    
    $('#productName').val(product.name || '');
    $('#productPrice').val(product.price || '');
    $('#productStock').val(product.stock || '');
    $('#productDescription').val(product.description || '');
    
    // Set category if available
    if (product.category && product.category.id) {
        $('#productCategory').val(product.category.id);
    }
    
    // Load product images
    loadProductImages(product.id);
    
    // Update page title
    document.title = `Danh mục sửa sản phẩm}`;
    $('h1').text(`Danh mục sửa sản phẩm`);
}

// Load product images
function loadProductImages(productId) {
    console.log('Loading product images for ID:', productId);
    
    $.ajax({
        url: `/api/product-images/by-product/${productId}`,
        method: 'GET',
        success: function(response) {
            console.log('Product images loaded:', response);
            
            if (response.success && response.data) {
                const images = response.data;
                displayProductImages(images);
            } else {
                console.log('No images found for this product');
                displayProductImages([]);
            }
        },
        error: function(xhr, status, error) {
            console.error('Error loading product images:', error);
            console.log('No images found or error occurred');
            displayProductImages([]);
        }
    });
}

// Display product images
function displayProductImages(images) {
    console.log('Displaying product images:', images);
    
    // Store images globally for preview navigation
    window.currentProductImages = images;
    
    const currentImagesDiv = $('#currentImages');
    currentImagesDiv.empty();
    
    if (images && images.length > 0) {
        images.forEach((image, index) => {
            const isPrimary = image.isPrimary;
            const primaryBadge = isPrimary ? 
                '<div class="absolute top-2 left-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full font-medium">Chính</div>' : '';
            
            const imageHtml = `
                <div class="image-card relative group bg-white rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden border border-gray-100 cursor-pointer" 
                     onclick="openImagePreview('${image.imageUrl}', ${index})">
                    <div class="relative overflow-hidden">
                        <img src="${image.imageUrl}" alt="Product Image ${index + 1}" 
                             class="w-full h-40 object-cover transition-transform duration-500 group-hover:scale-110">
                        <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                        ${primaryBadge}
                        
                        <!-- Zoom icon -->
                        <div class="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                            <div class="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg">
                                <i class="fas fa-search-plus text-gray-700 text-sm"></i>
                            </div>
                        </div>
                        
                        <!-- Action buttons -->
                        <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                            <div class="flex space-x-3">
                                ${!isPrimary ? `
                                    <button type="button" onclick="event.stopPropagation(); setPrimaryImage('${image.id}')" 
                                            class="action-btn bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center hover:from-blue-600 hover:to-blue-700 shadow-xl transform hover:scale-110 transition-all duration-200"
                                            title="Đặt làm ảnh chính">
                                        <i class="fas fa-star text-sm"></i>
                                    </button>
                                ` : ''}
                                <button type="button" onclick="event.stopPropagation(); removeImage('${image.id}')" 
                                        class="action-btn bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full w-12 h-12 flex items-center justify-center hover:from-red-600 hover:to-red-700 shadow-xl transform hover:scale-110 transition-all duration-200"
                                        title="Xóa ảnh">
                                    <i class="fas fa-trash text-sm"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Card footer -->
                    <div class="p-4 bg-gradient-to-r from-gray-50 to-gray-100">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center space-x-2">
                                <div class="w-2 h-2 rounded-full ${isPrimary ? 'bg-yellow-500 animate-pulse' : 'bg-gray-400'}"></div>
                                <span class="text-sm font-medium ${isPrimary ? 'text-yellow-700' : 'text-gray-600'}">
                                    ${isPrimary ? 'Ảnh chính' : 'Ảnh phụ'}
                                </span>
                            </div>
                            <div class="text-xs text-gray-500">
                                #${index + 1}
                            </div>
                        </div>
                    </div>
                    <input type="hidden" name="existingImages" value="${image.id}">
                </div>
            `;
            currentImagesDiv.append(imageHtml);
        });
    } else {
        currentImagesDiv.html(`
            <div class="col-span-full text-center py-16">
                <div class="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-12 max-w-md mx-auto shadow-lg border border-gray-200">
                    <div class="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 rounded-3xl"></div>
                    <div class="relative z-10">
                        <div class="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                            <i class="fas fa-images text-3xl text-white"></i>
                        </div>
                        <h3 class="text-xl font-bold text-gray-700 mb-3">Chưa có hình ảnh</h3>
                        <p class="text-gray-500 mb-6">Sản phẩm này chưa có hình ảnh nào. Hãy thêm hình ảnh để làm cho sản phẩm hấp dẫn hơn!</p>
                        <div class="flex items-center justify-center space-x-2 text-sm text-gray-400">
                            <i class="fas fa-arrow-up"></i>
                            <span>Tải lên hình ảnh ở phía dưới</span>
                        </div>
                    </div>
                </div>
            </div>
        `);
    }
}

// Upload new images
function uploadNewImages(files) {
    console.log('Uploading new images:', files);
    
    const productId = $('#productId').val();
    const formData = new FormData();
    
    // Add files to FormData
    for (let i = 0; i < files.length; i++) {
        formData.append('images', files[i]);
    }
    
    // Show loading state
    showToast('Đang tải lên hình ảnh...', 'info');
    
    $.ajax({
        url: `/api/product-images/upload/${productId}`,
        method: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success: function(response) {
            console.log('Images uploaded successfully:', response);
            if (response.success) {
                showToast('Tải lên hình ảnh thành công!', 'success');
                // Reload product images
                loadProductImages(productId);
                // Clear file input
                $('#productImage').val('');
            } else {
                showToast('Không thể tải lên hình ảnh', 'error');
            }
        },
        error: function(xhr, status, error) {
            console.error('Error uploading images:', error);
            showToast('Lỗi khi tải lên hình ảnh', 'error');
        }
    });
}

// Set primary image function
function setPrimaryImage(imageId) {
    console.log('Setting primary image:', imageId);
    
    if (confirm('Bạn có chắc chắn muốn đặt hình ảnh này làm ảnh chính?')) {
        $.ajax({
            url: `/api/product-images/${imageId}/set-primary`,
            method: 'PUT',
            success: function(response) {
                console.log('Primary image set successfully:', response);
                if (response.success) {
                    showToast('Đặt ảnh chính thành công!', 'success');
                    // Reload product images
                    const productId = $('#productId').val();
                    loadProductImages(productId);
                } else {
                    showToast('Không thể đặt ảnh chính', 'error');
                }
            },
            error: function(xhr, status, error) {
                console.error('Error setting primary image:', error);
                showToast('Lỗi khi đặt ảnh chính', 'error');
            }
        });
    }
}

// Remove image function
function removeImage(imageId) {
    console.log('Removing image:', imageId);
    
    if (confirm('Bạn có chắc chắn muốn xóa hình ảnh này?')) {
        $.ajax({
            url: `/api/product-images/${imageId}`,
            method: 'DELETE',
            success: function(response) {
                console.log('Image removed successfully:', response);
                if (response.success) {
                    showToast('Xóa hình ảnh thành công!', 'success');
                    // Reload product images
                    const productId = $('#productId').val();
                    loadProductImages(productId);
                } else {
                    showToast('Không thể xóa hình ảnh', 'error');
                }
            },
            error: function(xhr, status, error) {
                console.error('Error removing image:', error);
                showToast('Lỗi khi xóa hình ảnh', 'error');
            }
        });
    }
}

// Load categories for dropdown
function loadCategories() {
    console.log('Loading categories...');
    
    $.ajax({
        url: '/api/categories',
        method: 'GET',
        success: function(response) {
            console.log('Categories loaded:', response);
            
            if (response.success && response.data && response.data.items) {
                const categories = response.data.items;
                populateCategoriesDropdown(categories);
            }
        },
        error: function(xhr, status, error) {
            console.error('Error loading categories:', error);
            showToast('Lỗi khi tải danh mục', 'error');
        }
    });
}

// Populate categories dropdown
function populateCategoriesDropdown(categories) {
    const select = $('#productCategory');
    
    // Clear existing options except the first one
    select.find('option:not(:first)').remove();
    
    // Add category options
    categories.forEach(category => {
        select.append(`<option value="${category.id}">${category.name}</option>`);
    });
}

// Update product
function updateProduct() {
    console.log('Updating product...');
    
    // Validate form
    if (!validateForm()) {
        return;
    }
    
    // Get form data
    const formData = {
        name: $('#productName').val().trim(),
        price: parseFloat($('#productPrice').val()),
        stock: parseInt($('#productStock').val()),
        description: $('#productDescription').val().trim(),
        categoryId: $('#productCategory').val()
    };
    
    const productId = $('#productId').val();
    
    console.log('Updating product with data:', formData);
    
    // Show loading state
    setLoadingState(true);
    $('#submitEdit').prop('disabled', true).html('<i class="fas fa-spinner fa-spin mr-2"></i>Đang cập nhật...');
    
    // Send update request
    $.ajax({
        url: `/api/products/${productId}`,
        method: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(formData),
        success: function(response) {
            console.log('Product updated successfully:', response);
            
            if (response.success) {
                showToast('Cập nhật sản phẩm thành công!', 'success');
                
                // Redirect to products list after a short delay
                setTimeout(() => {
                    window.location.href = '/admin/products';
                }, 1500);
            } else {
                showToast(response.message || 'Cập nhật sản phẩm thất bại', 'error');
            }
        },
        error: function(xhr, status, error) {
            console.error('Error updating product:', error);
            
            let errorMessage = 'Lỗi khi cập nhật sản phẩm';
            if (xhr.responseJSON && xhr.responseJSON.message) {
                errorMessage = xhr.responseJSON.message;
            }
            
            showToast(errorMessage, 'error');
        },
        complete: function() {
            setLoadingState(false);
            $('#submitEdit').prop('disabled', false).html('<i class="fas fa-save mr-2"></i>Cập nhật sản phẩm');
        }
    });
}

// Validate form
function validateForm() {
    let isValid = true;
    
    // Clear previous error states
    $('.error').removeClass('error');
    $('.error-message').remove();
    
    // Validate product name
    const name = $('#productName').val().trim();
    if (!name) {
        showFieldError('#productName', 'Tên sản phẩm là bắt buộc');
        isValid = false;
    }
    
    // Validate price
    const price = parseFloat($('#productPrice').val());
    if (!price || price < 0) {
        showFieldError('#productPrice', 'Giá sản phẩm phải lớn hơn 0');
        isValid = false;
    }
    
    // Validate stock
    const stock = parseInt($('#productStock').val());
    if (isNaN(stock) || stock < 0) {
        showFieldError('#productStock', 'Số lượng tồn kho phải lớn hơn hoặc bằng 0');
        isValid = false;
    }
    
    // Validate category
    const category = $('#productCategory').val();
    if (!category) {
        showFieldError('#productCategory', 'Vui lòng chọn danh mục');
        isValid = false;
    }
    
    return isValid;
}

// Show field error
function showFieldError(selector, message) {
    const field = $(selector);
    field.addClass('error');
    
    // Add error message
    const errorDiv = $(`<div class="error-message">${message}</div>`);
    field.after(errorDiv);
    
    // Shake animation
    field.css('animation', 'shake 0.5s ease-in-out');
    setTimeout(() => {
        field.css('animation', '');
    }, 500);
}

// Set loading state
function setLoadingState(loading) {
    if (loading) {
        $('#editProductForm').addClass('loading');
    } else {
        $('#editProductForm').removeClass('loading');
    }
}

// Open image preview modal
function openImagePreview(imageUrl, currentIndex) {
    console.log('Opening image preview:', imageUrl, currentIndex);
    
    // Get all images for navigation from the current displayed images
    const allImages = window.currentProductImages || [];
    
    // Create modal HTML
    const modalHtml = `
        <div id="imagePreviewModal" class="fixed inset-0 bg-black bg-opacity-90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div class="relative max-w-6xl max-h-full w-full h-full flex items-center justify-center">
                <!-- Close button -->
                <button onclick="closeImagePreview()" 
                        class="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full w-12 h-12 flex items-center justify-center transition-all duration-200 hover:scale-110">
                    <i class="fas fa-times text-xl"></i>
                </button>
                
                <!-- Navigation buttons -->
                ${allImages.length > 1 ? `
                    <button onclick="navigateImage(-1)" 
                            class="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full w-12 h-12 flex items-center justify-center transition-all duration-200 hover:scale-110">
                        <i class="fas fa-chevron-left text-xl"></i>
                    </button>
                    <button onclick="navigateImage(1)" 
                            class="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full w-12 h-12 flex items-center justify-center transition-all duration-200 hover:scale-110">
                        <i class="fas fa-chevron-right text-xl"></i>
                    </button>
                ` : ''}
                
                <!-- Image container -->
                <div class="relative w-full h-full flex items-center justify-center">
                    <img id="previewImage" src="${imageUrl}" alt="Product Image Preview" 
                         class="max-w-full max-h-full object-contain rounded-lg shadow-2xl transition-all duration-300">
                </div>
                
                <!-- Image info -->
                <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-full">
                    <span id="imageCounter">${currentIndex + 1} / ${allImages.length}</span>
                </div>
                
                <!-- Download button -->
                <button onclick="downloadImage('${imageUrl}')" 
                        class="absolute bottom-4 right-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105 flex items-center space-x-2">
                    <i class="fas fa-download"></i>
                    <span>Tải xuống</span>
                </button>
            </div>
        </div>
    `;
    
    // Add modal to body
    $('body').append(modalHtml);
    
    // Store current image index
    window.currentImageIndex = currentIndex;
    window.allImages = allImages;
    
    // Add keyboard navigation
    $(document).on('keydown.imagePreview', function(e) {
        if (e.key === 'Escape') {
            closeImagePreview();
        } else if (e.key === 'ArrowLeft') {
            navigateImage(-1);
        } else if (e.key === 'ArrowRight') {
            navigateImage(1);
        }
    });
    
    // Prevent body scroll
    $('body').addClass('overflow-hidden');
}

// Close image preview modal
function closeImagePreview() {
    $('#imagePreviewModal').remove();
    $(document).off('keydown.imagePreview');
    $('body').removeClass('overflow-hidden');
}

// Navigate between images
function navigateImage(direction) {
    if (!window.allImages || window.allImages.length <= 1) return;
    
    window.currentImageIndex += direction;
    
    // Loop around
    if (window.currentImageIndex < 0) {
        window.currentImageIndex = window.allImages.length - 1;
    } else if (window.currentImageIndex >= window.allImages.length) {
        window.currentImageIndex = 0;
    }
    
    const newImage = window.allImages[window.currentImageIndex];
    if (newImage) {
        $('#previewImage').attr('src', newImage.imageUrl);
        $('#imageCounter').text(`${window.currentImageIndex + 1} / ${window.allImages.length}`);
    }
}

// Download image
function downloadImage(imageUrl) {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `product-image-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
    
    // Show toast
    setTimeout(() => {
        $(`#${toastId}`).removeClass('translate-x-full');
    }, 50);
    
    // Hide toast after 3 seconds
    setTimeout(() => {
        $(`#${toastId}`).addClass('translate-x-full');
        setTimeout(() => {
            $(`#${toastId}`).remove();
        }, 300);
    }, 3000);
}

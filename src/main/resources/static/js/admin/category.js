// API Configuration
const API_BASE_URL = '/api/categories';

// Wait for jQuery to be ready
function initApp() {
    if (typeof $ === 'undefined') {
        console.log('jQuery not loaded yet, retrying...');
        setTimeout(initApp, 100);
        return;
    }

    console.log('jQuery ready, setting up event listeners');

    // Load categories on page load
    loadCategories();

    // Show modal with smooth animation
    $('#addCategoryButton').click(function (e) {
        e.preventDefault();
        console.log('Add category button clicked');
        showAddCategoryModal();
    });

    // Close modal with smooth animation
    $('#closeModal, #cancelAdd').click(function (e) {
        e.preventDefault();
        console.log('Close modal clicked');
        hideAddCategoryModal();
    });

    // Close modal when clicking outside
    $('#addCategoryModal').click(function (e) {
        if (e.target === this) {
            console.log('Clicked outside modal');
            hideAddCategoryModal();
        }
    });

    // Close modal with ESC key
    $(document).keydown(function (e) {
        if (e.key === 'Escape') {
            console.log('ESC key pressed');
            hideAddCategoryModal();
        }
    });

    // Real-time slug preview with fast animation
    $('#categoryName').on('input', function () {
        const name = $(this).val().trim();
        const $preview = $('#slugPreview');
        const $slugText = $('#slugText');

        if (name) {
            const slug = nameToSlug(name);
            $slugText.text(slug);

            // Fast slide down with fade
            $preview.css({
                'opacity': '0',
                'transform': 'translateY(-5px)',
                'transition': 'all 0.15s ease-out'
            }).slideDown(150, function () {
                $(this).css({
                    'opacity': '1',
                    'transform': 'translateY(0)'
                });
            });
        } else {
            // Fast slide up with fade
            $preview.css({
                'opacity': '0',
                'transform': 'translateY(-5px)',
                'transition': 'all 0.1s ease-in'
            }).slideUp(100);
        }
    });

    // Form submit with validation
    $('#submitAdd').click(function (e) {
        e.preventDefault();
        console.log('Form submitted');
        handleAddCategorySubmit();
    });

    // Delete confirmation modal events
    $('#closeDeleteModal, #cancelDelete').click(function (e) {
        e.preventDefault();
        console.log('Close delete modal clicked');
        hideDeleteConfirmModal();
    });

    // Close delete modal when clicking outside
    $('#deleteConfirmModal').click(function (e) {
        if (e.target === this) {
            console.log('Clicked outside delete modal');
            hideDeleteConfirmModal();
        }
    });

    // Close delete modal with ESC key
    $(document).keydown(function (e) {
        if (e.key === 'Escape' && !$('#deleteConfirmModal').hasClass('hidden')) {
            console.log('ESC key pressed on delete modal');
            hideDeleteConfirmModal();
        }
    });

    // Confirm delete
    $('#confirmDelete').click(function (e) {
        e.preventDefault();
        console.log('Confirm delete clicked');
        const categoryId = $('#confirmDelete').data('category-id');
        if (categoryId) {
            hideDeleteConfirmModal();
            deleteCategoryAjax(categoryId);
        }
    });
}

// Initialize app when everything is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

// Show modal with zoom in animation
function showAddCategoryModal() {
    console.log('Showing add category modal');
    const $modal = $('#addCategoryModal');
    const $content = $('#modalContent');

    // Remove hidden class and show modal
    $modal.removeClass('hidden');

    // Reset transform for zoom in animation
    $content.css({
        'transform': 'scale(0.3)',
        'opacity': '0'
    });

    // Animate modal background quickly
    $modal.css('opacity', '0').animate({
        'opacity': '1'
    }, 150, 'easeOutQuart');

    // Zoom in animation with bounce effect
    $content.animate({
        'opacity': '1'
    }, 100, 'easeOutQuart').css({
        'transform': 'scale(1)',
        'transition': 'all 0.2s cubic-bezier(0.68, -0.55, 0.265, 1.55)'
    });
}

// Hide modal with zoom out animation
function hideAddCategoryModal() {
    console.log('Hiding add category modal');
    const $modal = $('#addCategoryModal');
    const $content = $('#modalContent');

    // Zoom out animation
    $content.css({
        'transform': 'scale(0.3)',
        'opacity': '0',
        'transition': 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)'
    });

    // Animate modal background quickly
    $modal.animate({
        'opacity': '0'
    }, 150, 'easeInQuart', function () {
        $modal.addClass('hidden');
        // Reset form and styles
        $('#addCategoryForm')[0].reset();
        $('#slugPreview').slideUp(100);

        // Reset submit button to original state
        const $submitBtn = $('#submitAdd');
        $submitBtn.prop('disabled', false).html('<i class="fas fa-plus mr-2"></i>Thêm danh mục');
        $submitBtn.removeClass('bg-green-600 bg-red-600').addClass('bg-blue-600 hover:bg-blue-700');

        // Reset modal to add mode
        $('#modalTitle').text('Thêm danh mục mới');
        $('#categoryId').val('');

        // Reset modal content styles for next open
        $content.css({
            'transform': '',
            'opacity': '',
            'transition': ''
        });
    });
}

// Show delete confirmation modal
function showDeleteConfirmModal(category) {
    console.log('Showing delete confirmation modal for:', category);

    // Populate modal with category data
    $('#deleteCategoryName').text(category.name);
    $('#deleteCategorySlug').text(category.description);
    $('#confirmDelete').data('category-id', category.id);

    // Show modal with animation
    const $modal = $('#deleteConfirmModal');
    const $content = $('#deleteModalContent');

    $modal.removeClass('hidden');

    // Reset transform for zoom in animation
    $content.css({
        'transform': 'scale(0.3)',
        'opacity': '0'
    });

    // Animate modal background
    $modal.css('opacity', '0').animate({
        'opacity': '1'
    }, 150, 'easeOutQuart');

    // Zoom in animation with bounce effect
    $content.animate({
        'opacity': '1'
    }, 100, 'easeOutQuart').css({
        'transform': 'scale(1)',
        'transition': 'all 0.2s cubic-bezier(0.68, -0.55, 0.265, 1.55)'
    });
}

// Hide delete confirmation modal
function hideDeleteConfirmModal() {
    console.log('Hiding delete confirmation modal');
    const $modal = $('#deleteConfirmModal');
    const $content = $('#deleteModalContent');

    // Zoom out animation
    $content.css({
        'transform': 'scale(0.3)',
        'opacity': '0',
        'transition': 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)'
    });

    // Animate modal background
    $modal.animate({
        'opacity': '0'
    }, 150, 'easeInQuart', function () {
        $modal.addClass('hidden');

        // Reset modal content styles for next open
        $content.css({
            'transform': '',
            'opacity': '',
            'transition': ''
        });
    });
}

// Handle form submit with validation
function handleAddCategorySubmit() {
    console.log('Handling form submit');
    const $nameInput = $('#categoryName');
    const $categoryId = $('#categoryId');
    const name = $nameInput.val().trim();
    const categoryId = $categoryId.val();

    if (!name) {
        // Smooth shake animation for validation error
        $nameInput.addClass('border-red-500 bg-red-50');

        // Custom smooth shake animation
        $nameInput.css({
            'animation': 'shake 0.5s ease-in-out',
            'transform-origin': 'center'
        });

        setTimeout(function () {
            $nameInput.removeClass('border-red-500 bg-red-50');
            $nameInput.css('animation', '');
        }, 500);
        return;
    }

    // Convert name to slug for description
    const description = nameToSlug(name);

    // Check if editing or adding
    if (categoryId) {
        console.log('Updating category:', { id: categoryId, name, description });
        updateCategoryAjax(categoryId, name, description);
    } else {
        console.log('Adding category:', { name, description });
        submitCategoryAjax(name, description);
    }
}

// Utility function to convert name to slug (no accents, lowercase)
function nameToSlug(name) {
    return name
        .toLowerCase()
        .trim()
        // Remove Vietnamese accents
        .replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, 'a')
        .replace(/[èéẹẻẽêềếệểễ]/g, 'e')
        .replace(/[ìíịỉĩ]/g, 'i')
        .replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, 'o')
        .replace(/[ùúụủũưừứựửữ]/g, 'u')
        .replace(/[ỳýỵỷỹ]/g, 'y')
        .replace(/đ/g, 'd')
        // Remove special characters, keep only letters, numbers, spaces, and hyphens
        .replace(/[^a-z0-9\s-]/g, '')
        // Replace spaces with hyphens
        .replace(/\s+/g, '-')
        // Remove multiple consecutive hyphens
        .replace(/-+/g, '-')
        // Remove leading and trailing hyphens
        .replace(/^-|-$/g, '');
}

// AJAX submit function
function submitCategoryAjax(name, description) {
    const $submitBtn = $('#submitAdd');
    const $form = $('#addCategoryForm');
    const originalText = $submitBtn.html();

    try {
        // Show loading state
        $submitBtn.prop('disabled', true).html('<i class="fas fa-spinner fa-spin mr-2"></i>Đang thêm...');

        console.log('Making AJAX call to add category');
        console.log('Data:', { name, description });

        // AJAX call
        $.ajax({
            url: API_BASE_URL,
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ name, description }),
            success: function (result) {
                console.log('AJAX success:', result);

                if (result.success) {
                    // Success animation
                    $submitBtn.html('<i class="fas fa-check mr-2"></i>Thành công!');
                    $submitBtn.removeClass('bg-blue-600 hover:bg-blue-700').addClass('bg-green-600');

                    // Show success message and close modal
                    setTimeout(function () {
                        hideAddCategoryModal();
                        // Reset button to original state
                        $submitBtn.prop('disabled', false).html(originalText);
                        $submitBtn.removeClass('bg-green-600').addClass('bg-blue-600 hover:bg-blue-700');
                        // Reload categories to show new category
                        loadCategories();
                    }, 150);
                } else {
                    // Error handling
                    $submitBtn.html('<i class="fas fa-times mr-2"></i>Lỗi!');
                    $submitBtn.removeClass('bg-blue-600 hover:bg-blue-700').addClass('bg-red-600');

                    setTimeout(function () {
                        showToast('Không thể thêm danh mục: ' + (result.message || 'Lỗi không xác định'), 'error');
                        // Reset button
                        $submitBtn.prop('disabled', false).html(originalText);
                        $submitBtn.removeClass('bg-red-600').addClass('bg-blue-600 hover:bg-blue-700');
                    }, 150);
                }
            },
            error: function (xhr, status, error) {
                console.error('AJAX error:', error);
                console.error('Response:', xhr.responseText);

                // Error animation
                $submitBtn.html('<i class="fas fa-times mr-2"></i>Lỗi!');
                $submitBtn.removeClass('bg-blue-600 hover:bg-blue-700').addClass('bg-red-600');

                setTimeout(function () {
                    showToast('Lỗi khi thêm danh mục. Vui lòng thử lại!', 'error');
                    // Reset button
                    $submitBtn.prop('disabled', false).html(originalText);
                    $submitBtn.removeClass('bg-red-600').addClass('bg-blue-600 hover:bg-blue-700');
                }, 150);
            }
        });
    } catch (error) {
        console.error('Error in AJAX call:', error);
        // Error animation
        $submitBtn.html('<i class="fas fa-times mr-2"></i>Lỗi!');
        $submitBtn.removeClass('bg-blue-600 hover:bg-blue-700').addClass('bg-red-600');

        setTimeout(function () {
            showToast('Lỗi khi thêm danh mục. Vui lòng thử lại!', 'error');
            // Reset button
            $submitBtn.prop('disabled', false).html(originalText);
            $submitBtn.removeClass('bg-red-600').addClass('bg-blue-600 hover:bg-blue-700');
        }, 150);
    }
}

// AJAX update function
function updateCategoryAjax(categoryId, name, description) {
    const $submitBtn = $('#submitAdd');
    const originalText = $submitBtn.html();

    try {
        // Show loading state
        $submitBtn.prop('disabled', true).html('<i class="fas fa-spinner fa-spin mr-2"></i>Đang cập nhật...');

        console.log('Making AJAX call to update category');
        console.log('Data:', { id: categoryId, name, description });

        // AJAX call
        $.ajax({
            url: `${API_BASE_URL}/${categoryId}`,
            method: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify({ name, description }),
            success: function (result) {
                console.log('AJAX success:', result);

                if (result.success) {
                    // Success animation
                    $submitBtn.html('<i class="fas fa-check mr-2"></i>Cập nhật thành công!');
                    $submitBtn.removeClass('bg-blue-600 hover:bg-blue-700').addClass('bg-green-600');

                    // Show success message and close modal
                    setTimeout(function () {
                        hideAddCategoryModal();
                        // Reset button to original state
                        $submitBtn.prop('disabled', false).html(originalText);
                        $submitBtn.removeClass('bg-green-600').addClass('bg-blue-600 hover:bg-blue-700');
                        // Reload categories to show updated category
                        loadCategories();
                    }, 150);
                } else {
                    // Error handling
                    $submitBtn.html('<i class="fas fa-times mr-2"></i>Lỗi!');
                    $submitBtn.removeClass('bg-blue-600 hover:bg-blue-700').addClass('bg-red-600');

                    setTimeout(function () {
                        showToast('Không thể cập nhật danh mục: ' + (result.message || 'Lỗi không xác định'), 'error');
                        // Reset button
                        $submitBtn.prop('disabled', false).html(originalText);
                        $submitBtn.removeClass('bg-red-600').addClass('bg-blue-600 hover:bg-blue-700');
                    }, 150);
                }
            },
            error: function (xhr, status, error) {
                console.error('AJAX error:', error);
                console.error('Response:', xhr.responseText);

                // Error animation
                $submitBtn.html('<i class="fas fa-times mr-2"></i>Lỗi!');
                $submitBtn.removeClass('bg-blue-600 hover:bg-blue-700').addClass('bg-red-600');

                setTimeout(function () {
                    showToast('Lỗi khi cập nhật danh mục. Vui lòng thử lại!', 'error');
                    // Reset button
                    $submitBtn.prop('disabled', false).html(originalText);
                    $submitBtn.removeClass('bg-red-600').addClass('bg-blue-600 hover:bg-blue-700');
                }, 150);
            }
        });
    } catch (error) {
        console.error('Error in AJAX call:', error);
        // Error animation
        $submitBtn.html('<i class="fas fa-times mr-2"></i>Lỗi!');
        $submitBtn.removeClass('bg-blue-600 hover:bg-blue-700').addClass('bg-red-600');

        setTimeout(function () {
            showToast('Lỗi khi cập nhật danh mục. Vui lòng thử lại!', 'error');
            // Reset button
            $submitBtn.prop('disabled', false).html(originalText);
            $submitBtn.removeClass('bg-red-600').addClass('bg-blue-600 hover:bg-blue-700');
        }, 150);
    }
}

// Load categories with AJAX
function loadCategories() {
    console.log('Loading categories...');

    // Show loading state
    const $container = $('.grid');
    $container.html(`
    <div class="col-span-full flex justify-center items-center py-12">
      <div class="text-center">
        <i class="fas fa-spinner fa-spin text-4xl text-blue-600 mb-4"></i>
        <p class="text-gray-600">Đang tải danh mục...</p>
      </div>
    </div>
  `);

    try {
        $.ajax({
            url: API_BASE_URL,
            method: 'GET',
            success: function (result) {
                console.log('Categories loaded:', result);
                console.log('Result success:', result.success);
                console.log('Result data:', result.data);
                console.log('Result data items:', result.data ? result.data.items : 'No data');

                if (result.success && result.data && result.data.items && result.data.items.length > 0) {
                    console.log('Displaying categories with count:', result.data.items.length);
                    displayCategories(result.data.items);
                } else {
                    console.log('No categories found, showing empty state');
                    showEmptyState();
                }
            },
            error: function (xhr, status, error) {
                console.error('Error loading categories:', error);
                showErrorState();
            }
        });
    } catch (error) {
        console.error('Error in loadCategories:', error);
        showErrorState();
    }
}

// Display categories in grid
function displayCategories(categories) {
    console.log('Displaying categories:', categories);
    console.log('Categories count:', categories.length);

    // Store categories data globally for edit/delete functions
    window.categoriesData = categories;

    const $container = $('.grid');
    let html = '';

    categories.forEach(function (category, index) {
        const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-red-500', 'bg-yellow-500', 'bg-indigo-500'];
        const icons = ['fas fa-mobile-alt', 'fas fa-laptop', 'fas fa-headphones', 'fas fa-gamepad', 'fas fa-camera', 'fas fa-tv'];

        const colorClass = colors[index % colors.length];
        const iconClass = icons[index % icons.length];

        html += `
      <div class="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all duration-300 hover:scale-105 category-card" data-category-id="${category.id}">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center">
            <div class="w-12 h-12 ${colorClass} rounded-lg flex items-center justify-center">
              <i class="${iconClass} text-white text-xl"></i>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-semibold text-gray-900">${category.name}</h3>
              <p class="text-sm text-gray-600">
                <i class="fas fa-spinner fa-spin mr-1"></i>Đang đếm sản phẩm...
              </p>
            </div>
          </div>
          <div class="flex space-x-2">
            <button class="text-blue-600 hover:text-blue-900 text-sm transition-colors" onclick="editCategory('${category.id}')">
              <i class="fas fa-edit mr-1"></i>Sửa
            </button>
            <button class="text-red-600 hover:text-red-900 text-sm transition-colors" onclick="deleteCategory('${category.id}')">
              <i class="fas fa-trash mr-1"></i>Xóa
            </button>
          </div>
        </div>
        <p class="text-sm text-gray-600">${category.description || 'Không có mô tả'}</p>
        <div class="mt-3 text-xs text-gray-500">
          <span class="bg-gray-100 px-2 py-1 rounded">ID: ${category.id}</span>
          <span class="bg-gray-100 px-2 py-1 rounded ml-2">Slug: ${category.description}</span>
        </div>
        <div class="mt-2 text-xs text-gray-400">
          <i class="fas fa-calendar mr-1"></i>Tạo: ${new Date(category.createdAt).toLocaleDateString('vi-VN')}
        </div>
      </div>
    `;
    });

    $container.html(html);

    // Add smooth fade-in animation
    $container.find('> div').each(function (index) {
        $(this).css({
            'opacity': '0',
            'transform': 'translateY(20px)'
        }).delay(index * 100).animate({
            'opacity': '1'
        }, 300).css({
            'transform': 'translateY(0)',
            'transition': 'all 0.3s ease-out'
        });
    });

    // Load product count for each category
    loadProductCountsForCategories(categories);
}

// Load product counts for all categories
function loadProductCountsForCategories(categories) {
    console.log('Loading product counts for categories...');

    categories.forEach(function (category, index) {
        // Add delay to avoid overwhelming the server
        setTimeout(function () {
            loadProductCountForCategory(category.id, index);
        }, index * 1); // 200ms delay between each request
    });
}

// Load product count for a specific category
function loadProductCountForCategory(categoryId, index) {
    console.log(`Loading product count for category ${categoryId}...`);

    try {
        $.ajax({
            url: `/api/products?categoryId=${categoryId}`,
            method: 'GET',
            success: function (result) {
                console.log(`Product count for category ${categoryId}:`, result);

                let productCount = 0;
                if (result.success && result.data && result.data.items) {
                    productCount = result.data.items.length;
                }

                // Update the product count in the UI
                updateProductCountInUI(categoryId, productCount);
            },
            error: function (xhr, status, error) {
                console.error(`Error loading product count for category ${categoryId}:`, error);
                // Show error state
                updateProductCountInUI(categoryId, 'Lỗi');
            }
        });
    } catch (error) {
        console.error(`Error in loadProductCountForCategory for ${categoryId}:`, error);
        updateProductCountInUI(categoryId, 'Lỗi');
    }
}

// Update product count in the UI
function updateProductCountInUI(categoryId, count) {
    const $categoryCard = $(`.category-card[data-category-id="${categoryId}"]`);
    const $productCountElement = $categoryCard.find('p.text-sm.text-gray-600');

    if (count === 'Lỗi') {
        $productCountElement.html('<i class="fas fa-exclamation-triangle text-red-500 mr-1"></i>Lỗi đếm sản phẩm');
    } else {
        $productCountElement.html(`<i class="fas fa-box text-blue-500 mr-1"></i>${count} sản phẩm`);
    }
}

// Show empty state
function showEmptyState() {
    const $container = $('.grid');
    $container.html(`
    <div class="col-span-full flex justify-center items-center py-12">
      <div class="text-center">
        <i class="fas fa-folder-open text-6xl text-gray-300 mb-4"></i>
        <h3 class="text-xl font-semibold text-gray-700 mb-2">Chưa có danh mục nào</h3>
        <p class="text-gray-500 mb-4">Hãy thêm danh mục đầu tiên để bắt đầu</p>
        <button id="addFirstCategory" class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          <i class="fas fa-plus mr-2"></i>Thêm danh mục đầu tiên
        </button>
      </div>
    </div>
  `);

    // Add click handler for empty state button
    $('#addFirstCategory').click(function (e) {
        e.preventDefault();
        showAddCategoryModal();
    });
}

// Show error state
function showErrorState() {
    const $container = $('.grid');
    $container.html(`
    <div class="col-span-full flex justify-center items-center py-12">
      <div class="text-center">
        <i class="fas fa-exclamation-triangle text-6xl text-red-300 mb-4"></i>
        <h3 class="text-xl font-semibold text-gray-700 mb-2">Lỗi tải dữ liệu</h3>
        <p class="text-gray-500 mb-4">Không thể tải danh sách danh mục</p>
        <button id="retryLoad" class="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors">
          <i class="fas fa-redo mr-2"></i>Thử lại
        </button>
      </div>
    </div>
  `);

    // Add click handler for retry button
    $('#retryLoad').click(function (e) {
        e.preventDefault();
        loadCategories();
    });
}

// Edit category function
function editCategory(categoryId) {
    console.log('Edit category:', categoryId);

    // Find category data
    const category = findCategoryById(categoryId);
    if (!category) {
        showToast('Không tìm thấy danh mục', 'error');
        return;
    }

    // Open edit modal
    showEditCategoryModal(category);
}

// Find category by ID
function findCategoryById(categoryId) {
    // This will be populated when categories are loaded
    return window.categoriesData ? window.categoriesData.find(cat => cat.id === categoryId) : null;
}

// Show edit category modal
function showEditCategoryModal(category) {
    console.log('Showing edit category modal for:', category);

    // Update modal title
    $('#modalTitle').text('Chỉnh sửa danh mục');

    // Populate form with category data
    $('#categoryName').val(category.name);
    $('#categoryId').val(category.id);

    // Show slug preview
    const slug = nameToSlug(category.name);
    $('#slugText').text(slug);
    $('#slugPreview').show();

    // Update submit button
    $('#submitAdd').html('<i class="fas fa-save mr-2"></i>Cập nhật');

    // Show modal
    showAddCategoryModal();
}

// Delete category function
function deleteCategory(categoryId) {
    console.log('Delete category:', categoryId);

    // Find category data
    const category = findCategoryById(categoryId);
    if (!category) {
        showToast('Không tìm thấy danh mục', 'error');
        return;
    }

    // Show confirmation modal
    showDeleteConfirmModal(category);
}

// AJAX delete function
function deleteCategoryAjax(categoryId) {
    console.log('Deleting category:', categoryId);

    // Find category data for toast message
    const category = findCategoryById(categoryId);
    if (!category) {
        showToast('Không tìm thấy danh mục', 'error');
        return;
    }

    try {
        // Show loading state on the category card
        const $categoryCard = $(`.category-card[data-category-id="${categoryId}"]`);
        const originalContent = $categoryCard.html();

        $categoryCard.html(`
      <div class="flex items-center justify-center py-8">
        <div class="text-center">
          <i class="fas fa-spinner fa-spin text-2xl text-red-600 mb-2"></i>
          <p class="text-sm text-gray-600">Đang xóa...</p>
        </div>
      </div>
    `);

        // AJAX call
        $.ajax({
            url: `${API_BASE_URL}/${categoryId}`,
            method: 'DELETE',
            success: function (result) {
                console.log('Delete success:', result);

                if (result.success) {
                    // Success animation
                    $categoryCard.html(`
            <div class="flex items-center justify-center py-8">
              <div class="text-center">
                <i class="fas fa-check text-2xl text-green-600 mb-2"></i>
                <p class="text-sm text-gray-600">Đã xóa thành công!</p>
              </div>
            </div>
          `);

                    // Show success toast
                    showToast(`Đã xóa danh mục "${category.name}" thành công!`, 'success');

                    // Fade out and remove immediately
                    $categoryCard.fadeOut(150, function () {
                        $(this).remove();
                        // Reload categories to refresh the grid
                        loadCategories();
                    });
                } else {
                    // Error handling
                    showToast('Không thể xóa danh mục. Vui lòng thử lại!', 'error');
                    $categoryCard.html(`
            <div class="flex items-center justify-center py-8">
              <div class="text-center">
                <i class="fas fa-times text-2xl text-red-600 mb-2"></i>
                <p class="text-sm text-gray-600">Lỗi khi xóa!</p>
              </div>
            </div>
          `);

                    setTimeout(function () {
                        $categoryCard.html(originalContent);
                    }, 2000);
                }
            },
            error: function (xhr, status, error) {
                console.error('Delete error:', error);
                console.error('Response:', xhr.responseText);

                // Error animation
                showToast('Lỗi khi xóa danh mục. Vui lòng thử lại!', 'error');
                $categoryCard.html(`
          <div class="flex items-center justify-center py-8">
            <div class="text-center">
              <i class="fas fa-times text-2xl text-red-600 mb-2"></i>
              <p class="text-sm text-gray-600">Lỗi khi xóa!</p>
            </div>
          </div>
        `);

                setTimeout(function () {
                    $categoryCard.html(originalContent);
                }, 2000);
            }
        });
    } catch (error) {
        console.error('Error in deleteCategoryAjax:', error);
        showToast('Lỗi khi xóa danh mục. Vui lòng thử lại!', 'error');
    }
}

// Show toast notification
function showToast(message, type = 'success') {
    const toastId = 'toast-' + Date.now();
    const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';
    const icon = type === 'success' ? 'fas fa-check' : 'fas fa-times';

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

// Categories Main Management
const CategoriesMain = {
    // API Configuration
    API_BASE_URL: '/api/categories',

    // Initialize app
    init: function() {
        console.log('CategoriesMain.init() called');
        if (typeof $ === 'undefined') {
            console.log('jQuery not loaded yet, retrying...');
            setTimeout(this.init.bind(this), 100);
            return;
        }

        console.log('jQuery ready, setting up event listeners');
        this.setupEventListeners();
        this.loadCategories();
    },

    // Setup event listeners
    setupEventListeners: function() {
        // Show modal with smooth animation
        $('#addCategoryButton').click(function (e) {
            e.preventDefault();
            console.log('Add category button clicked');
            console.log('CategoriesUI available:', typeof CategoriesUI);
            if (typeof CategoriesUI !== 'undefined') {
                CategoriesUI.showAddCategoryModal();
            } else {
                console.error('CategoriesUI is not defined!');
            }
        });

        // Close modal with smooth animation
        $('#closeModal, #cancelAdd').click(function (e) {
            e.preventDefault();
            console.log('Close modal clicked');
            CategoriesUI.hideAddCategoryModal();
        });

        // Close modal when clicking outside
        $('#addCategoryModal').click(function (e) {
            if (e.target === this || e.target.classList.contains('flex')) {
                console.log('Clicked outside modal');
                CategoriesUI.hideAddCategoryModal();
            }
        });

        // Close modal with ESC key
        $(document).keydown(function (e) {
            if (e.key === 'Escape') {
                console.log('ESC key pressed');
                CategoriesUI.hideAddCategoryModal();
            }
        });

        // Real-time slug preview with fast animation
        $('#categoryName').on('input', function () {
            const name = $(this).val().trim();
            const $preview = $('#slugPreview');
            const $slugText = $('#slugText');

            if (name) {
                const slug = CategoriesUI.nameToSlug(name);
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
            CategoriesMain.handleAddCategorySubmit();
        });

        // Delete confirmation modal events
        $('#closeDeleteModal, #cancelDelete').click(function (e) {
            e.preventDefault();
            console.log('Close delete modal clicked');
            CategoriesUI.hideDeleteConfirmModal();
        });

        // Close delete modal when clicking outside
        $('#deleteConfirmModal').click(function (e) {
            if (e.target === this || e.target.classList.contains('flex')) {
                console.log('Clicked outside delete modal');
                CategoriesUI.hideDeleteConfirmModal();
            }
        });

        // Close delete modal with ESC key
        $(document).keydown(function (e) {
            if (e.key === 'Escape' && !$('#deleteConfirmModal').hasClass('hidden')) {
                console.log('ESC key pressed on delete modal');
                CategoriesUI.hideDeleteConfirmModal();
            }
        });

        // Confirm delete
        $('#confirmDelete').click(function (e) {
            e.preventDefault();
            console.log('Confirm delete clicked');
            const categoryId = $('#confirmDelete').data('category-id');
            if (categoryId) {
                CategoriesUI.hideDeleteConfirmModal();
                CategoriesMain.deleteCategoryAjax(categoryId);
            }
        });
    },

    // Handle form submit with validation
    handleAddCategorySubmit: function() {
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
        const description = CategoriesUI.nameToSlug(name);

        // Check if editing or adding
        if (categoryId) {
            console.log('Updating category:', { id: categoryId, name, description });
            this.updateCategoryAjax(categoryId, name, description);
        } else {
            console.log('Adding category:', { name, description });
            this.submitCategoryAjax(name, description);
        }
    },

    // AJAX submit function
    submitCategoryAjax: function(name, description) {
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
                url: this.API_BASE_URL,
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
                            CategoriesUI.hideAddCategoryModal();
                            // Reset button to original state
                            $submitBtn.prop('disabled', false).html(originalText);
                            $submitBtn.removeClass('bg-green-600').addClass('bg-blue-600 hover:bg-blue-700');
                            // Reload categories to show new category
                            CategoriesMain.loadCategories();
                        }, 150);
                    } else {
                        // Error handling
                        $submitBtn.html('<i class="fas fa-times mr-2"></i>Lỗi!');
                        $submitBtn.removeClass('bg-blue-600 hover:bg-blue-700').addClass('bg-red-600');

                        setTimeout(function () {
                            CategoriesUI.showToast('Không thể thêm danh mục: ' + (result.message || 'Lỗi không xác định'), 'error');
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
                        CategoriesUI.showToast('Lỗi khi thêm danh mục. Vui lòng thử lại!', 'error');
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
                CategoriesUI.showToast('Lỗi khi thêm danh mục. Vui lòng thử lại!', 'error');
                // Reset button
                $submitBtn.prop('disabled', false).html(originalText);
                $submitBtn.removeClass('bg-red-600').addClass('bg-blue-600 hover:bg-blue-700');
            }, 150);
        }
    },

    // AJAX update function
    updateCategoryAjax: function(categoryId, name, description) {
        const $submitBtn = $('#submitAdd');
        const originalText = $submitBtn.html();

        try {
            // Show loading state
            $submitBtn.prop('disabled', true).html('<i class="fas fa-spinner fa-spin mr-2"></i>Đang cập nhật...');

            console.log('Making AJAX call to update category');
            console.log('Data:', { id: categoryId, name, description });

            // AJAX call
            $.ajax({
                url: `${this.API_BASE_URL}/${categoryId}`,
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
                            CategoriesUI.hideAddCategoryModal();
                            // Reset button to original state
                            $submitBtn.prop('disabled', false).html(originalText);
                            $submitBtn.removeClass('bg-green-600').addClass('bg-blue-600 hover:bg-blue-700');
                            // Reload categories to show updated category
                            CategoriesMain.loadCategories();
                        }, 150);
                    } else {
                        // Error handling
                        $submitBtn.html('<i class="fas fa-times mr-2"></i>Lỗi!');
                        $submitBtn.removeClass('bg-blue-600 hover:bg-blue-700').addClass('bg-red-600');

                        setTimeout(function () {
                            CategoriesUI.showToast('Không thể cập nhật danh mục: ' + (result.message || 'Lỗi không xác định'), 'error');
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
                        CategoriesUI.showToast('Lỗi khi cập nhật danh mục. Vui lòng thử lại!', 'error');
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
                CategoriesUI.showToast('Lỗi khi cập nhật danh mục. Vui lòng thử lại!', 'error');
                // Reset button
                $submitBtn.prop('disabled', false).html(originalText);
                $submitBtn.removeClass('bg-red-600').addClass('bg-blue-600 hover:bg-blue-700');
            }, 150);
        }
    },

    // Load categories with AJAX
    loadCategories: function() {
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
                url: this.API_BASE_URL,
                method: 'GET',
                success: function (result) {
                    console.log('Categories loaded:', result);
                    console.log('Result success:', result.success);
                    console.log('Result data:', result.data);
                    console.log('Result data items:', result.data ? result.data.items : 'No data');

                    if (result.success && result.data && result.data.items && result.data.items.length > 0) {
                        console.log('Displaying categories with count:', result.data.items.length);
                        CategoriesUI.displayCategories(result.data.items);
                    } else {
                        console.log('No categories found, showing empty state');
                        CategoriesUI.showEmptyState();
                    }
                },
                error: function (xhr, status, error) {
                    console.error('Error loading categories:', error);
                    CategoriesUI.showErrorState();
                }
            });
        } catch (error) {
            console.error('Error in loadCategories:', error);
            CategoriesUI.showErrorState();
        }
    },

    // AJAX delete function
    deleteCategoryAjax: function(categoryId) {
        console.log('Deleting category:', categoryId);

        // Find category data for toast message
        const category = CategoriesUI.findCategoryById(categoryId);
        if (!category) {
            CategoriesUI.showToast('Không tìm thấy danh mục', 'error');
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
                url: `${this.API_BASE_URL}/${categoryId}`,
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
                        CategoriesUI.showToast(`Đã xóa danh mục "${category.name}" thành công!`, 'success');

                        // Fade out and remove immediately
                        $categoryCard.fadeOut(150, function () {
                            $(this).remove();
                            // Reload categories to refresh the grid
                            CategoriesMain.loadCategories();
                        });
                    } else {
                        // Error handling
                        CategoriesUI.showToast('Không thể xóa danh mục. Vui lòng thử lại!', 'error');
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
                    CategoriesUI.showToast('Lỗi khi xóa danh mục. Vui lòng thử lại!', 'error');
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
            CategoriesUI.showToast('Lỗi khi xóa danh mục. Vui lòng thử lại!', 'error');
        }
    }
};

// Initialize app when everything is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        CategoriesMain.init();
    });
} else {
    CategoriesMain.init();
}

// Categories UI Management
const CategoriesUI = {
    // Show add category modal with zoom in animation
    showAddCategoryModal: function() {
        console.log('Showing add category modal');
        const $modal = $('#addCategoryModal');
        const $content = $('#modalContent');

        // Remove hidden class and show modal
        $modal.removeClass('hidden').show();
        
        // Ensure modal is properly displayed
        $modal.css('display', 'block');

        // Reset transform for zoom in animation
        $content.css({
            'transform': 'scale(0.7)',
            'opacity': '0'
        });

        // Animate modal background
        $modal.css('opacity', '0').animate({
            'opacity': '1'
        }, 200);

        // Zoom in animation with delay
        setTimeout(function() {
            $content.animate({
                'opacity': '1'
            }, 200, function() {
                $content.css('transform', 'scale(1)');
            });
        }, 10);
    },

    // Hide add category modal with zoom out animation
    hideAddCategoryModal: function() {
        console.log('Hiding add category modal');
        const $modal = $('#addCategoryModal');
        const $content = $('#modalContent');

        // Zoom out animation
        $content.css({
            'transform': 'scale(0.7)',
            'opacity': '0'
        });

        // Animate modal background
        $modal.animate({
            'opacity': '0'
        }, 200, function() {
            $modal.addClass('hidden').hide();
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
    },

    // Show edit category modal
    showEditCategoryModal: function(category) {
        console.log('Showing edit category modal for:', category);

        // Update modal title
        $('#modalTitle').text('Chỉnh sửa danh mục');

        // Populate form with category data
        $('#categoryName').val(category.name);
        $('#categoryId').val(category.id);

        // Show slug preview
        const slug = this.nameToSlug(category.name);
        $('#slugText').text(slug);
        $('#slugPreview').show();

        // Update submit button
        $('#submitAdd').html('<i class="fas fa-save mr-2"></i>Cập nhật');

        // Show modal
        this.showAddCategoryModal();
    },

    // Show delete confirmation modal
    showDeleteConfirmModal: function(category) {
        console.log('Showing delete confirmation modal for:', category);

        // Populate modal with category data
        $('#deleteCategoryName').text(category.name);
        $('#deleteCategorySlug').text(category.description);
        $('#confirmDelete').data('category-id', category.id);

        // Show modal with animation
        const $modal = $('#deleteConfirmModal');
        const $content = $('#deleteModalContent');

        $modal.removeClass('hidden').show();
        
        // Ensure modal is properly displayed
        $modal.css('display', 'block');

        // Reset transform for zoom in animation
        $content.css({
            'transform': 'scale(0.7)',
            'opacity': '0'
        });

        // Animate modal background
        $modal.css('opacity', '0').animate({
            'opacity': '1'
        }, 200);

        // Zoom in animation
        $content.animate({
            'opacity': '1'
        }, 200, function() {
            $content.css('transform', 'scale(1)');
        });
    },

    // Hide delete confirmation modal
    hideDeleteConfirmModal: function() {
        console.log('Hiding delete confirmation modal');
        const $modal = $('#deleteConfirmModal');
        const $content = $('#deleteModalContent');

        // Zoom out animation
        $content.css({
            'transform': 'scale(0.7)',
            'opacity': '0'
        });

        // Animate modal background
        $modal.animate({
            'opacity': '0'
        }, 200, function() {
            $modal.addClass('hidden').hide();

            // Reset modal content styles for next open
            $content.css({
                'transform': '',
                'opacity': '',
                'transition': ''
            });
        });
    },

    // Display categories in grid
    displayCategories: function(categories) {
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
                            <span class="text-blue-600 hover:text-blue-900 text-sm cursor-pointer" onclick="CategoriesUI.editCategory('${category.id}')">
                                <i class="fas fa-edit mr-1"></i>Sửa
                            </span>
                            <span class="text-red-600 hover:text-red-900 text-sm cursor-pointer" onclick="CategoriesUI.deleteCategory('${category.id}')">
                                <i class="fas fa-trash mr-1"></i>Xóa
                            </span>
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
        this.loadProductCountsForCategories(categories);
    },

    // Load product counts for all categories
    loadProductCountsForCategories: function(categories) {
        console.log('Loading product counts for categories...');

        categories.forEach(function (category, index) {
            // Add delay to avoid overwhelming the server
            setTimeout(function () {
                CategoriesUI.loadProductCountForCategory(category.id, index);
            }, index * 1); // 1ms delay between each request
        });
    },

    // Load product count for a specific category
    loadProductCountForCategory: function(categoryId, index) {
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
                    CategoriesUI.updateProductCountInUI(categoryId, productCount);
                },
                error: function (xhr, status, error) {
                    console.error(`Error loading product count for category ${categoryId}:`, error);
                    // Show error state
                    CategoriesUI.updateProductCountInUI(categoryId, 'Lỗi');
                }
            });
        } catch (error) {
            console.error(`Error in loadProductCountForCategory for ${categoryId}:`, error);
            CategoriesUI.updateProductCountInUI(categoryId, 'Lỗi');
        }
    },

    // Update product count in the UI
    updateProductCountInUI: function(categoryId, count) {
        const $categoryCard = $(`.category-card[data-category-id="${categoryId}"]`);
        const $productCountElement = $categoryCard.find('p.text-sm.text-gray-600');

        if (count === 'Lỗi') {
            $productCountElement.html('<i class="fas fa-exclamation-triangle text-red-500 mr-1"></i>Lỗi đếm sản phẩm');
        } else {
            $productCountElement.html(`<i class="fas fa-box text-blue-500 mr-1"></i>${count} sản phẩm`);
        }
    },

    // Show empty state
    showEmptyState: function() {
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
            CategoriesUI.showAddCategoryModal();
        });
    },

    // Show error state
    showErrorState: function() {
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
            CategoriesMain.loadCategories();
        });
    },

    // Edit category function
    editCategory: function(categoryId) {
        console.log('Edit category:', categoryId);

        // Find category data
        const category = this.findCategoryById(categoryId);
        if (!category) {
            this.showToast('Không tìm thấy danh mục', 'error');
            return;
        }

        // Open edit modal
        this.showEditCategoryModal(category);
    },

    // Find category by ID
    findCategoryById: function(categoryId) {
        // This will be populated when categories are loaded
        return window.categoriesData ? window.categoriesData.find(cat => cat.id === categoryId) : null;
    },

    // Delete category function
    deleteCategory: function(categoryId) {
        console.log('Delete category:', categoryId);

        // Find category data
        const category = this.findCategoryById(categoryId);
        if (!category) {
            this.showToast('Không tìm thấy danh mục', 'error');
            return;
        }

        // Show confirmation modal
        this.showDeleteConfirmModal(category);
    },

    // Utility function to convert name to slug (no accents, lowercase)
    nameToSlug: function(name) {
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
    },

    // Show toast notification
    showToast: function(message, type = 'success') {
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
};

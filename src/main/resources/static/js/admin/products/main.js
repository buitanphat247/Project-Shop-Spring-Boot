// =====================================================
// MAIN PRODUCTS MODULE - Entry point và initialization
// =====================================================

// Global variables
let isSearchMode = false;
let currentSearchTerm = '';

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM ready, initializing products app');

    // Load products on page load
    loadProducts();

    // Initialize pagination
    initializePagination();

    // Search functionality
    const searchInput = document.querySelector('input[placeholder="Tìm kiếm sản phẩm..."]');
    if (searchInput) {
        searchInput.addEventListener('input', function () {
            const searchTerm = this.value.trim();
            console.log('Searching for:', searchTerm);
            currentSearchTerm = searchTerm;
            currentPage = 0; // Reset to first page when searching
            searchProducts(searchTerm);
        });
    }

    // Retry button
    const retryBtn = document.getElementById('retryLoad');
    if (retryBtn) {
        retryBtn.addEventListener('click', function (e) {
            e.preventDefault();
            console.log('Retry button clicked');
            currentPage = 0;
            isSearchMode = false;
            currentSearchTerm = '';
            loadProducts();
        });
    }

    // Add first product button
    const addFirstBtn = document.getElementById('addFirstProduct');
    if (addFirstBtn) {
        addFirstBtn.addEventListener('click', function (e) {
            e.preventDefault();
            console.log('Add first product clicked - redirecting to create page');
            window.location.href = '/admin/products/create';
        });
    }

    // Delete modal event listeners
    const cancelDeleteBtn = document.getElementById('cancelDelete');
    if (cancelDeleteBtn) {
        cancelDeleteBtn.addEventListener('click', function (e) {
            e.preventDefault();
            hideDeleteModal();
        });
    }

    // Close modal button
    const closeDeleteModalBtn = document.getElementById('closeDeleteModal');
    if (closeDeleteModalBtn) {
        closeDeleteModalBtn.addEventListener('click', function (e) {
            e.preventDefault();
            hideDeleteModal();
        });
    }

    const confirmDeleteBtn = document.getElementById('confirmDelete');
    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', function (e) {
            e.preventDefault();
            const modal = document.getElementById('deleteModal');
            const productId = modal.getAttribute('data-product-id');
            if (productId) {
                deleteProduct(productId);
            }
        });
    }

    // Close modal when clicking backdrop
    const deleteModal = document.getElementById('deleteModal');
    if (deleteModal) {
        deleteModal.addEventListener('click', function (e) {
            if (e.target === this) {
                hideDeleteModal();
            }
        });
    }

    // Close modal with Escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            const modal = document.getElementById('deleteModal');
            if (!modal.classList.contains('hidden')) {
                hideDeleteModal();
            }
        }
    });

    // jQuery click outside to close modal
    $(document).on('click', '#deleteModal', function(e) {
        if (e.target === this) {
            hideDeleteModal();
        }
    });

    // jQuery escape key to close modal
    $(document).on('keydown', function(e) {
        if (e.key === 'Escape' && $('#deleteModal').is(':visible')) {
            hideDeleteModal();
        }
    });
});

// Export functions for global access
window.loadProducts = loadProducts;
window.searchProducts = searchProducts;
window.deleteProduct = deleteProduct;
window.editProduct = editProduct;
window.goToPage = goToPage;
window.nextPage = nextPage;
window.prevPage = prevPage;
window.firstPage = firstPage;
window.lastPage = lastPage;
window.showToast = showToast;
window.closeToast = closeToast;
window.showDeleteModal = showDeleteModal;
window.hideDeleteModal = hideDeleteModal;

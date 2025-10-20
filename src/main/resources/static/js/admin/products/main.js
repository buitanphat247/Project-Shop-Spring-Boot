// =====================================================
// MAIN PRODUCTS MODULE - Entry point và initialization
// =====================================================

// Global variables
let isSearchMode = false;
let currentSearchTerm = '';

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM ready, initializing products app');

    // Get page from URL parameters only
    const urlParams = new URLSearchParams(window.location.search);
    const pageFromUrl = urlParams.get('page');
    
    // Determine which page to load
    let initialPage = 0;
    if (pageFromUrl !== null) {
        initialPage = parseInt(pageFromUrl) || 0;
    }
    
    console.log(`🔢 [PAGINATION] Loading page ${initialPage} (from URL: ${pageFromUrl})`);

    // Load products on page load with specific page
    loadProducts(initialPage);

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
            // Update URL to page 0 when searching
            updateURL(0);
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
            const deleteModal = document.getElementById('deleteModal');
            const editModal = document.getElementById('editProductModal');
            if (deleteModal && !deleteModal.classList.contains('hidden')) {
                hideDeleteModal();
            }
            if (editModal && !editModal.classList.contains('hidden')) {
                hideEditProductModal();
            }
        }
    });

    // Edit modal event listeners
    const cancelEditBtn = document.getElementById('cancelEdit');
    if (cancelEditBtn) {
        cancelEditBtn.addEventListener('click', function (e) {
            e.preventDefault();
            hideEditProductModal();
        });
    }

    // Close edit modal button
    const closeEditModalBtn = document.getElementById('closeEditModal');
    if (closeEditModalBtn) {
        closeEditModalBtn.addEventListener('click', function (e) {
            e.preventDefault();
            hideEditProductModal();
        });
    }

    // Edit form submission
    const editForm = document.getElementById('editProductForm');
    if (editForm) {
        editForm.addEventListener('submit', function (e) {
            e.preventDefault();
            updateProduct();
        });
    }

    // Close edit modal when clicking backdrop
    const editModal = document.getElementById('editProductModal');
    if (editModal) {
        editModal.addEventListener('click', function (e) {
            // Check if click is on the backdrop (not on modal content)
            if (e.target.hasAttribute('data-modal-backdrop') || e.target === this) {
                console.log('Edit modal clicked outside - closing');
                hideEditProductModal();
            }
        });
    }

    // jQuery click outside to close modals
    $(document).on('click', '#deleteModal', function(e) {
        if (e.target === this) {
            hideDeleteModal();
        }
    });
    
    $(document).on('click', '#editProductModal', function(e) {
        // Check if click is on the backdrop (not on modal content)
        if (e.target === this || $(e.target).attr('data-modal-backdrop')) {
            console.log('Edit modal clicked outside (jQuery) - closing');
            hideEditProductModal();
        }
    });

    // jQuery escape key to close modals
    $(document).on('keydown', function(e) {
        if (e.key === 'Escape') {
            if ($('#deleteModal').is(':visible')) {
                hideDeleteModal();
            }
            if ($('#editProductModal').is(':visible')) {
                hideEditProductModal();
            }
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
window.updateURL = updateURL;
window.showToast = showToast;
window.closeToast = closeToast;
window.showDeleteModal = showDeleteModal;
window.hideDeleteModal = hideDeleteModal;
window.showEditProductModal = showEditProductModal;
window.hideEditProductModal = hideEditProductModal;
window.updateProduct = updateProduct;

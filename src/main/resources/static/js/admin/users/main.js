// =====================================================
// MAIN USER MODULE - Entry point và initialization
// =====================================================

// Global variables
let isUserSearchMode = false;
let currentUserSearchTerm = '';

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM ready, initializing users app');

    // Load users on page load
    loadUsers();

    // Initialize pagination
    initializeUserPagination();

    // Search functionality
    const searchInput = document.querySelector('input[placeholder*="Tìm kiếm người dùng"], input[placeholder*="tìm kiếm người dùng"]');
    if (searchInput) {
        searchInput.addEventListener('input', function () {
            const searchTerm = this.value.trim();
            console.log('Searching for users:', searchTerm);
            currentUserSearchTerm = searchTerm;
            currentUserPage = 0; // Reset to first page when searching
            searchUsers(searchTerm);
        });
    }

    // Retry button
    const retryBtn = document.getElementById('retryUserLoad');
    if (retryBtn) {
        retryBtn.addEventListener('click', function (e) {
            e.preventDefault();
            console.log('Retry button clicked');
            currentUserPage = 0;
            isUserSearchMode = false;
            currentUserSearchTerm = '';
            loadUsers();
        });
    }

    // Add first user button
    const addFirstBtn = document.getElementById('addFirstUser');
    if (addFirstBtn) {
        addFirstBtn.addEventListener('click', function (e) {
            e.preventDefault();
            console.log('Add first user clicked - redirecting to create page');
            window.location.href = '/admin/users/create';
        });
    }

    // User profile modal event listeners
    const closeUserModalBtn = document.getElementById('closeUserModal');
    if (closeUserModalBtn) {
        closeUserModalBtn.addEventListener('click', hideUserViewModal);
    }

    // Close modal when clicking outside
    $(document).on('click', '#userProfileModal', function(e) {
        if (e.target === this) {
            hideUserViewModal();
        }
    });

    // Close modal with Escape key
    $(document).on('keydown', function(e) {
        if (e.key === 'Escape' && $('#userProfileModal').is(':visible')) {
            hideUserViewModal();
        }
    });

    // User delete modal event listeners
    const cancelUserDeleteBtn = document.getElementById('cancelUserDelete');
    if (cancelUserDeleteBtn) {
        cancelUserDeleteBtn.addEventListener('click', function (e) {
            e.preventDefault();
            hideUserDeleteModal();
        });
    }

    const confirmUserDeleteBtn = document.getElementById('confirmUserDelete');
    if (confirmUserDeleteBtn) {
        confirmUserDeleteBtn.addEventListener('click', function (e) {
            e.preventDefault();
            const modal = document.getElementById('userDeleteModal');
            const userId = modal.getAttribute('data-user-id');
            if (userId) {
                deleteUser(userId);
            }
        });
    }

    // Close modal when clicking backdrop
    const userDeleteModal = document.getElementById('userDeleteModal');
    if (userDeleteModal) {
        userDeleteModal.addEventListener('click', function (e) {
            if (e.target === this) {
                hideUserDeleteModal();
            }
        });
    }

    // Close modal with Escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            const modal = document.getElementById('userDeleteModal');
            if (modal && !modal.classList.contains('hidden')) {
                hideUserDeleteModal();
            }
        }
    });
});

// Export functions for global access
window.loadUsers = loadUsers;
window.searchUsers = searchUsers;
window.deleteUser = deleteUser;
window.editUser = editUser;
window.goToUserPage = goToUserPage;
window.nextUserPage = nextUserPage;
window.prevUserPage = prevUserPage;
window.firstUserPage = firstUserPage;
window.lastUserPage = lastUserPage;
window.showUserToast = showUserToast;
window.closeUserToast = closeUserToast;
window.showUserDeleteModal = showUserDeleteModal;
window.hideUserDeleteModal = hideUserDeleteModal;


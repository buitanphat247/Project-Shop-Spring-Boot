// API Configuration
const API_BASE_URL = '/api/users';

// Wait for jQuery to be ready
function initApp() {
    if (typeof $ === 'undefined') {
        console.log('jQuery not loaded yet, retrying...');
        setTimeout(initApp, 100);
        return;
    }

    console.log('jQuery ready, setting up event listeners');

    // Load users on page load
    loadUsers();

    // Search functionality
    $('input[placeholder="Tìm kiếm khách hàng..."]').on('input', function() {
        const searchTerm = $(this).val().trim();
        searchUsers(searchTerm);
    });

    // Filter functionality
    $('select').on('change', function() {
        const filterValue = $(this).val();
        filterUsers(filterValue);
    });

    // Filter button
    $('button:contains("Lọc")').click(function() {
        const searchTerm = $('input[placeholder="Tìm kiếm khách hàng..."]').val().trim();
        const filterValue = $('select').val();
        searchUsers(searchTerm);
        filterUsers(filterValue);
    });
}

// Initialize app when everything is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

// Load users with AJAX
function loadUsers() {
    console.log('Loading users...');

    // Show loading state
    const $tbody = $('tbody');
    $tbody.html(`
        <tr>
            <td colspan="6" class="px-6 py-12 text-center">
                <div class="flex justify-center items-center">
                    <i class="fas fa-spinner fa-spin text-2xl text-blue-600 mr-3"></i>
                    <span class="text-gray-600">Đang tải danh sách người dùng...</span>
                </div>
            </td>
        </tr>
    `);

    try {
        $.ajax({
            url: API_BASE_URL,
            method: 'GET',
            success: function(result) {
                console.log('Users loaded:', result);
                
                if (result.success && result.data && result.data.items && result.data.items.length > 0) {
                    console.log('Displaying users with count:', result.data.items.length);
                    displayUsers(result.data.items);
                } else {
                    console.log('No users found, showing empty state');
                    showEmptyState();
                }
            },
            error: function(xhr, status, error) {
                console.error('Error loading users:', error);
                showErrorState();
            }
        });
    } catch (error) {
        console.error('Error in loadUsers:', error);
        showErrorState();
    }
}

// Display users in table
function displayUsers(users) {
    console.log('Displaying users:', users);
    console.log('Users count:', users.length);

    // Store users data globally for edit/delete functions
    window.usersData = users;

    const $tbody = $('tbody');
    let html = '';

    users.forEach(function(user, index) {
        const statusClass = user.deletedAt ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800';
        const statusText = user.deletedAt ? 'Bị chặn' : 'Hoạt động';
        const roleName = user.role ? user.role.name : 'N/A';
        const roleColor = roleName === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800';
        
        // Get initials from name
        const initials = user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : 'U';
        
        // Format date
        const joinDate = user.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : 'N/A';

        html += `
            <tr class="user-row" data-user-id="${user.id}">
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                        <div class="h-10 w-10 flex-shrink-0">
                            <div class="h-10 w-10 bg-blue-500 rounded-full flex items-center justify-center">
                                <span class="text-white font-medium text-sm">${initials}</span>
                            </div>
                        </div>
                        <div class="ml-4">
                            <div class="text-sm font-medium text-gray-900">${user.name || 'N/A'}</div>
                            <div class="text-sm text-gray-500">ID: ${user.id.substring(0, 8)}...</div>
                        </div>
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${user.email || 'N/A'}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${user.phone || 'N/A'}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex flex-col space-y-1">
                        <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusClass}">${statusText}</span>
                        <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full ${roleColor}">${roleName}</span>
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${joinDate}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button class="text-blue-600 hover:text-blue-900 transition-colors px-3 py-1 rounded-lg hover:bg-blue-50" onclick="viewUser('${user.id}')">
                        <i class="fas fa-eye mr-1"></i>Xem
                    </button>
                </td>
            </tr>
        `;
    });

    $tbody.html(html);

    // Add smooth fade-in animation
    $tbody.find('tr').each(function(index) {
        $(this).css({
            'opacity': '0',
            'transform': 'translateY(20px)'
        }).delay(index * 50).animate({
            'opacity': '1'
        }, 300).css({
            'transform': 'translateY(0)',
            'transition': 'all 0.3s ease-out'
        });
    });
}

// Search users
function searchUsers(searchTerm) {
    console.log('Searching users:', searchTerm);
    
    if (!searchTerm) {
        loadUsers();
        return;
    }

    try {
        $.ajax({
            url: `${API_BASE_URL}?name=${encodeURIComponent(searchTerm)}`,
            method: 'GET',
            success: function(result) {
                console.log('Search results:', result);
                
                if (result.success && result.data && result.data.items) {
                    displayUsers(result.data.items);
                } else {
                    showEmptyState();
                }
            },
            error: function(xhr, status, error) {
                console.error('Error searching users:', error);
                showErrorState();
            }
        });
    } catch (error) {
        console.error('Error in searchUsers:', error);
        showErrorState();
    }
}

// Filter users by status
function filterUsers(filterValue) {
    console.log('Filtering users by:', filterValue);
    
    if (!window.usersData) {
        loadUsers();
        return;
    }

    let filteredUsers = window.usersData;

    switch(filterValue) {
        case 'Hoạt động':
            filteredUsers = window.usersData.filter(user => !user.deletedAt);
            break;
        case 'Bị chặn':
            filteredUsers = window.usersData.filter(user => user.deletedAt);
            break;
        case 'Chờ xác nhận':
            // Add logic for pending users if needed
            filteredUsers = window.usersData.filter(user => !user.deletedAt && user.role && user.role.name === 'USER');
            break;
        default:
            // Show all users
            break;
    }

    displayUsers(filteredUsers);
}

// Show empty state
function showEmptyState() {
    const $tbody = $('tbody');
    $tbody.html(`
        <tr>
            <td colspan="6" class="px-6 py-12 text-center">
                <div class="flex flex-col items-center">
                    <i class="fas fa-users text-6xl text-gray-300 mb-4"></i>
                    <h3 class="text-xl font-semibold text-gray-700 mb-2">Chưa có người dùng nào</h3>
                    <p class="text-gray-500">Hãy thêm người dùng đầu tiên để bắt đầu</p>
                </div>
            </td>
        </tr>
    `);
}

// Show error state
function showErrorState() {
    const $tbody = $('tbody');
    $tbody.html(`
        <tr>
            <td colspan="6" class="px-6 py-12 text-center">
                <div class="flex flex-col items-center">
                    <i class="fas fa-exclamation-triangle text-6xl text-red-300 mb-4"></i>
                    <h3 class="text-xl font-semibold text-gray-700 mb-2">Lỗi tải dữ liệu</h3>
                    <p class="text-gray-500 mb-4">Không thể tải danh sách người dùng</p>
                    <button onclick="loadUsers()" class="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors">
                        <i class="fas fa-redo mr-2"></i>Thử lại
                    </button>
                </div>
            </td>
        </tr>
    `);
}

// View user details
function viewUser(userId) {
    console.log('View user:', userId);
    const user = findUserById(userId);
    if (user) {
        showUserProfileModal(user);
    }
}

// Show user profile modal
function showUserProfileModal(user) {
    console.log('Showing user profile modal for:', user);
    
    // Create modal HTML
    const modalHtml = `
        <div id="userProfileModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
            <div class="relative p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white transform">
                <div class="mt-3">
                    <div class="flex items-center justify-between mb-6">
                        <h3 class="text-2xl font-bold text-gray-900">Thông tin người dùng</h3>
                        <button id="closeUserModal" class="text-gray-400 hover:text-gray-600 text-2xl">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <!-- Avatar và thông tin cơ bản -->
                        <div class="space-y-4">
                            <div class="text-center">
                                <div class="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span class="text-white font-bold text-2xl">
                                        ${user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : 'U'}
                                    </span>
                                </div>
                                <h4 class="text-xl font-semibold text-gray-900">${user.name || 'N/A'}</h4>
                                <p class="text-sm text-gray-500">ID: ${user.id}</p>
                            </div>

                            <div class="space-y-3">
                                <div class="flex items-center space-x-3">
                                    <i class="fas fa-envelope text-gray-400 w-5"></i>
                                    <span class="text-gray-700">${user.email || 'N/A'}</span>
                                </div>
                                <div class="flex items-center space-x-3">
                                    <i class="fas fa-phone text-gray-400 w-5"></i>
                                    <span class="text-gray-700">${user.phone || 'N/A'}</span>
                                </div>
                                <div class="flex items-center space-x-3">
                                    <i class="fas fa-map-marker-alt text-gray-400 w-5"></i>
                                    <span class="text-gray-700">${user.address || 'N/A'}</span>
                                </div>
                            </div>
                        </div>

                        <!-- Thông tin chi tiết -->
                        <div class="space-y-4">
                            <div class="bg-gray-50 rounded-lg p-4">
                                <h5 class="font-semibold text-gray-900 mb-3">Trạng thái tài khoản</h5>
                                <div class="space-y-2">
                                    <div class="flex justify-between">
                                        <span class="text-gray-600">Trạng thái:</span>
                                        <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full ${user.deletedAt ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}">
                                            ${user.deletedAt ? 'Bị chặn' : 'Hoạt động'}
                                        </span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span class="text-gray-600">Vai trò:</span>
                                        <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full ${user.role && user.role.name === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}">
                                            ${user.role ? user.role.name : 'N/A'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div class="bg-gray-50 rounded-lg p-4">
                                <h5 class="font-semibold text-gray-900 mb-3">Thông tin thời gian</h5>
                                <div class="space-y-2">
                                    <div class="flex justify-between">
                                        <span class="text-gray-600">Ngày tạo:</span>
                                        <span class="text-gray-900">${user.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : 'N/A'}</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span class="text-gray-600">Cập nhật cuối:</span>
                                        <span class="text-gray-900">${user.updatedAt ? new Date(user.updatedAt).toLocaleDateString('vi-VN') : 'Chưa cập nhật'}</span>
                                    </div>
                                    ${user.deletedAt ? `
                                        <div class="flex justify-between">
                                            <span class="text-gray-600">Ngày chặn:</span>
                                            <span class="text-red-600">${new Date(user.deletedAt).toLocaleDateString('vi-VN')}</span>
                                        </div>
                                    ` : ''}
                                </div>
                            </div>

                            ${user.role ? `
                                <div class="bg-gray-50 rounded-lg p-4">
                                    <h5 class="font-semibold text-gray-900 mb-3">Thông tin vai trò</h5>
                                    <div class="space-y-2">
                                        <div class="flex justify-between">
                                            <span class="text-gray-600">Tên vai trò:</span>
                                            <span class="text-gray-900">${user.role.name}</span>
                                        </div>
                                        <div class="flex justify-between">
                                            <span class="text-gray-600">Mô tả:</span>
                                            <span class="text-gray-900">${user.role.description || 'N/A'}</span>
                                        </div>
                                        <div class="flex justify-between">
                                            <span class="text-gray-600">Ngày tạo vai trò:</span>
                                            <span class="text-gray-900">${user.role.createdAt ? new Date(user.role.createdAt).toLocaleDateString('vi-VN') : 'N/A'}</span>
                                        </div>
                                    </div>
                                </div>
                            ` : ''}
                        </div>
                    </div>

                    <div class="mt-6 flex justify-end">
                        <button id="closeUserModalBtn" class="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors">
                            <i class="fas fa-times mr-2"></i>Đóng
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Remove existing modal if any
    $('#userProfileModal').remove();
    
    // Add modal to body
    $('body').append(modalHtml);

    // Show modal with animation
    const $modal = $('#userProfileModal');
    const $content = $modal.find('.relative');
    
    $modal.css('opacity', '0');
    $content.css({
        'transform': 'scale(0.3)',
        'opacity': '0'
    });

    // Animate modal
    $modal.animate({ 'opacity': '1' }, 200);
    $content.animate({ 'opacity': '1' }, 100).css({
        'transform': 'scale(1)',
        'transition': 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)'
    });

    // Close modal events
    $('#closeUserModal, #closeUserModalBtn').click(function() {
        hideUserProfileModal();
    });

    // Close modal when clicking outside
    $modal.click(function(e) {
        if (e.target === this) {
            hideUserProfileModal();
        }
    });

    // Close modal with ESC key
    $(document).keydown(function(e) {
        if (e.key === 'Escape' && $modal.is(':visible')) {
            hideUserProfileModal();
        }
    });
}

// Hide user profile modal
function hideUserProfileModal() {
    const $modal = $('#userProfileModal');
    const $content = $modal.find('.relative');
    
    // Animate out
    $content.css({
        'transform': 'scale(0.3)',
        'opacity': '0',
        'transition': 'all 0.2s ease-in'
    });
    
    $modal.animate({ 'opacity': '0' }, 200, function() {
        $modal.remove();
    });
}

// Find user by ID
function findUserById(userId) {
    return window.usersData ? window.usersData.find(user => user.id === userId) : null;
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

    // Hide toast after 3 seconds
    setTimeout(() => {
        $(`#${toastId}`).addClass('translate-x-full');
        setTimeout(() => {
            $(`#${toastId}`).remove();
        }, 300);
    }, 3000);
}

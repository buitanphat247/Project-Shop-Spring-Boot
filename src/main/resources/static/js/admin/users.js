// API Configuration
const API_BASE_URL = '/api/users';

// Performance optimization variables
let searchTimeout;
let isDataLoaded = false;
let cachedUsers = [];
let currentSearchTerm = '';
let currentFilter = '';

// Wait for jQuery to be ready
function initApp() {
    if (typeof $ === 'undefined') {
        console.log('jQuery not loaded yet, retrying...');
        setTimeout(initApp, 50); // Reduced retry interval
        return;
    }

    console.log('jQuery ready, setting up event listeners');

    // Load users on page load with priority
    requestAnimationFrame(() => {
        loadUsers();
    });

    // Debounced search functionality (200ms delay - faster)
    $('input[placeholder="Tìm kiếm người dùng..."]').on('input', function() {
        const searchTerm = $(this).val().trim();
        
        // Clear previous timeout
        clearTimeout(searchTimeout);
        
        // Set new timeout for debounced search
        searchTimeout = setTimeout(() => {
            if (searchTerm !== currentSearchTerm) {
                currentSearchTerm = searchTerm;
                searchUsers(searchTerm);
            }
        }, 200); // Reduced delay for faster response
    });

    // Filter functionality
    $('select').on('change', function() {
        const filterValue = $(this).val();
        if (filterValue !== currentFilter) {
            currentFilter = filterValue;
            filterUsers(filterValue);
        }
    });

    // Filter button
    $('button:contains("Lọc")').click(function() {
        const searchTerm = $('input[placeholder="Tìm kiếm người dùng..."]').val().trim();
        const filterValue = $('select').val();
        currentSearchTerm = searchTerm;
        currentFilter = filterValue;
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

// Load users with AJAX (ultra-optimized with cache)
function loadUsers() {
    console.log('Loading users...');
    const startTime = performance.now();

    // Check for cached data first
    const cachedData = sessionStorage.getItem('usersCache');
    const cacheTime = sessionStorage.getItem('usersCacheTime');
    const now = Date.now();
    const cacheAge = cacheTime ? now - parseInt(cacheTime) : Infinity;
    
    // Use cache if it's less than 5 minutes old
    if (cachedData && cacheAge < 300000) {
        console.log('Using cached data (age:', Math.round(cacheAge / 1000), 'seconds)');
        try {
            const users = JSON.parse(cachedData);
            cachedUsers = users;
            isDataLoaded = true;
            window.usersData = users;
            
            const loadTime = performance.now() - startTime;
            console.log(`Users loaded from cache in ${loadTime.toFixed(2)}ms`);
            
            requestAnimationFrame(() => {
                displayUsers(users);
            });
            return;
        } catch (error) {
            console.error('Error parsing cached data:', error);
            // Fall through to AJAX request
        }
    }

    // Show loading state only if not already loaded
    if (!isDataLoaded) {
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
    }

    try {
        $.ajax({
            url: API_BASE_URL + '?basic=true', // Request only basic info
            method: 'GET',
            timeout: 1000, // Reduced to 1 second for basic info
            cache: true, // Enable cache for better performance
            dataType: 'json', // Explicitly set data type
            beforeSend: function(xhr) {
                // Add request timestamp for debugging
                xhr.setRequestHeader('X-Request-Time', Date.now());
            },
            success: function(result) {
                const loadTime = performance.now() - startTime;
                console.log(`Users loaded in ${loadTime.toFixed(2)}ms:`, result);
                
                if (result.success && result.data && result.data.items && result.data.items.length > 0) {
                    console.log('Displaying users with count:', result.data.items.length);
                    
                    // Cache the data
                    cachedUsers = result.data.items;
                    isDataLoaded = true;
                    window.usersData = cachedUsers;
                    
                    // Store in sessionStorage for next time
                    sessionStorage.setItem('usersCache', JSON.stringify(cachedUsers));
                    sessionStorage.setItem('usersCacheTime', Date.now().toString());
                    
                    // Use requestAnimationFrame for smooth rendering
                    requestAnimationFrame(() => {
                        displayUsers(cachedUsers);
                    });
                } else {
                    console.log('No users found, showing empty state');
                    showEmptyState();
                }
            },
            error: function(xhr, status, error) {
                const loadTime = performance.now() - startTime;
                console.error(`Error loading users after ${loadTime.toFixed(2)}ms:`, error);
                
                if (status === 'timeout') {
                    showErrorState('Timeout: Không thể tải dữ liệu trong thời gian cho phép');
                } else if (xhr.status === 0) {
                    showErrorState('Lỗi kết nối: Không thể kết nối đến server');
                } else {
                    showErrorState(`Lỗi ${xhr.status}: ${error}`);
                }
            }
        });
    } catch (error) {
        console.error('Error in loadUsers:', error);
        showErrorState();
    }
}

// Display users in table (ultra-optimized)
function displayUsers(users) {
    console.log('Displaying users:', users);
    console.log('Users count:', users.length);
    const startTime = performance.now();

    // Store users data globally for edit/delete functions
    window.usersData = users;

    const $tbody = $('tbody');
    
    // Use DocumentFragment for better performance
    const fragment = document.createDocumentFragment();
    const tempDiv = document.createElement('div');
    
    // Pre-compute common values
    const now = new Date();
    const dateFormatter = new Intl.DateTimeFormat('vi-VN');

    // Build HTML string more efficiently
    const htmlParts = users.map(function(user, index) {
        const statusClass = user.deletedAt ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800';
        const statusText = user.deletedAt ? 'Bị chặn' : 'Hoạt động';
        const roleName = user.role ? user.role.name : 'N/A';
        const roleColor = roleName === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800';
        
        // Get initials from name (optimized)
        const initials = user.name ? 
            user.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : 'U';
        
        // Format date (optimized)
        const joinDate = user.createdAt ? 
            dateFormatter.format(new Date(user.createdAt)) : 'N/A';

        return `
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

    // Set HTML in one operation
    $tbody.html(htmlParts.join(''));

    const renderTime = performance.now() - startTime;
    console.log(`Table rendered in ${renderTime.toFixed(2)}ms`);

    // Simplified animation for better performance
    $tbody.find('tr').css({
        'opacity': '0',
        'transform': 'translateY(10px)',
        'transition': 'all 0.2s ease-out'
    });

    // Animate in batches for better performance
    const animateRows = () => {
        $tbody.find('tr').each(function(index) {
            const $row = $(this);
            setTimeout(() => {
                $row.css({
                    'opacity': '1',
                    'transform': 'translateY(0)'
                });
            }, index * 20); // Reduced delay for faster animation
        });
    };

    // Use requestAnimationFrame for smooth animation
    requestAnimationFrame(animateRows);
}

// Search users (optimized with client-side filtering)
function searchUsers(searchTerm) {
    console.log('Searching users:', searchTerm);
    
    if (!searchTerm) {
        // If no search term, show all cached users
        if (isDataLoaded && cachedUsers.length > 0) {
            displayUsers(cachedUsers);
        } else {
            loadUsers();
        }
        return;
    }

    // If data is already loaded, use client-side filtering for better performance
    if (isDataLoaded && cachedUsers.length > 0) {
        console.log('Using client-side filtering for better performance');
        const filteredUsers = cachedUsers.filter(user => {
            const name = (user.name || '').toLowerCase();
            const email = (user.email || '').toLowerCase();
            const phone = (user.phone || '').toLowerCase();
            const searchLower = searchTerm.toLowerCase();
            
            return name.includes(searchLower) || 
                   email.includes(searchLower) || 
                   phone.includes(searchLower);
        });
        
        displayUsers(filteredUsers);
        return;
    }

    // Fallback to server-side search if data not cached
    try {
        $.ajax({
            url: `${API_BASE_URL}?name=${encodeURIComponent(searchTerm)}`,
            method: 'GET',
            timeout: 1000, // 5 second timeout for search
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

// Filter users by status (optimized)
function filterUsers(filterValue) {
    console.log('Filtering users by:', filterValue);
    
    // Use cached data if available
    const usersToFilter = isDataLoaded ? cachedUsers : (window.usersData || []);
    
    if (!usersToFilter || usersToFilter.length === 0) {
        loadUsers();
        return;
    }

    let filteredUsers = usersToFilter;

    switch(filterValue) {
        case 'Hoạt động':
            filteredUsers = usersToFilter.filter(user => !user.deletedAt);
            break;
        case 'Bị chặn':
            filteredUsers = usersToFilter.filter(user => user.deletedAt);
            break;
        case 'Chờ xác nhận':
            // Add logic for pending users if needed
            filteredUsers = usersToFilter.filter(user => !user.deletedAt && user.role && user.role.name === 'USER');
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
function showErrorState(customMessage = null) {
    const $tbody = $('tbody');
    const errorMessage = customMessage || 'Không thể tải danh sách người dùng';
    
    $tbody.html(`
        <tr>
            <td colspan="6" class="px-6 py-12 text-center">
                <div class="flex flex-col items-center">
                    <i class="fas fa-exclamation-triangle text-6xl text-red-300 mb-4"></i>
                    <h3 class="text-xl font-semibold text-gray-700 mb-2">Lỗi tải dữ liệu</h3>
                    <p class="text-gray-500 mb-4">${errorMessage}</p>
                    <button onclick="loadUsers()" class="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors">
                        <i class="fas fa-redo mr-2"></i>Thử lại
                    </button>
                </div>
            </td>
        </tr>
    `);
}

// View user details (optimized - load details on demand)
function viewUser(userId) {
    console.log('View user:', userId);
    const user = findUserById(userId);
    if (user) {
        // Show modal with basic info first
        showUserProfileModal(user, false);
        
        // Load detailed info in background
        loadUserDetails(userId);
    }
}

// Load detailed user information
function loadUserDetails(userId) {
    console.log('Loading detailed info for user:', userId);
    
    // Show loading indicator in modal
    const $modal = $('#userProfileModal');
    if ($modal.length) {
        const $loadingDiv = $modal.find('.loading-details');
        if ($loadingDiv.length) {
            $loadingDiv.html(`
                <div class="flex items-center justify-center py-4">
                    <i class="fas fa-spinner fa-spin text-blue-600 mr-2"></i>
                    <span class="text-gray-600">Đang tải thông tin chi tiết...</span>
                </div>
            `);
        }
    }
    
    try {
        $.ajax({
            url: `${API_BASE_URL}/${userId}`,
            method: 'GET',
            timeout: 3000, // 3 second timeout for details
            success: function(result) {
                console.log('User details loaded:', result);
                
                if (result.success && result.data) {
                    // Update modal with detailed info
                    updateUserProfileModal(result.data);
                } else {
                    console.warn('Failed to load user details:', result.message);
                    showUserDetailsError();
                }
            },
            error: function(xhr, status, error) {
                console.error('Error loading user details:', error);
                showUserDetailsError();
            }
        });
    } catch (error) {
        console.error('Error in loadUserDetails:', error);
        showUserDetailsError();
    }
}

// Show error for user details loading
function showUserDetailsError() {
    const $modal = $('#userProfileModal');
    if ($modal.length) {
        const $loadingDiv = $modal.find('.loading-details');
        if ($loadingDiv.length) {
            $loadingDiv.html(`
                <div class="flex items-center justify-center py-4 text-red-600">
                    <i class="fas fa-exclamation-triangle mr-2"></i>
                    <span>Không thể tải thông tin chi tiết</span>
                </div>
            `);
        }
    }
}

// Update user profile modal with detailed information
function updateUserProfileModal(detailedUser) {
    console.log('Updating modal with detailed user info:', detailedUser);
    
    const $modal = $('#userProfileModal');
    if (!$modal.length) return;
    
    const $loadingDiv = $modal.find('.loading-details');
    if (!$loadingDiv.length) return;
    
    // Format dates
    const dateFormatter = new Intl.DateTimeFormat('vi-VN');
    const formatDate = (dateString) => dateString ? dateFormatter.format(new Date(dateString)) : 'N/A';
    
    // Build detailed info HTML
    const detailedHtml = `
        <div class="bg-gray-50 rounded-lg p-4">
            <h5 class="font-semibold text-gray-900 mb-3">Trạng thái tài khoản</h5>
            <div class="space-y-2">
                <div class="flex justify-between">
                    <span class="text-gray-600">Trạng thái:</span>
                    <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full ${detailedUser.deletedAt ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}">
                        ${detailedUser.deletedAt ? 'Bị chặn' : 'Hoạt động'}
                    </span>
                </div>
                <div class="flex justify-between">
                    <span class="text-gray-600">Vai trò:</span>
                    <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full ${detailedUser.role && detailedUser.role.name === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}">
                        ${detailedUser.role ? detailedUser.role.name : 'N/A'}
                    </span>
                </div>
            </div>
        </div>

        <div class="bg-gray-50 rounded-lg p-4">
            <h5 class="font-semibold text-gray-900 mb-3">Thông tin thời gian</h5>
            <div class="space-y-2">
                <div class="flex justify-between">
                    <span class="text-gray-600">Ngày tạo:</span>
                    <span class="text-gray-900">${formatDate(detailedUser.createdAt)}</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-gray-600">Cập nhật cuối:</span>
                    <span class="text-gray-900">${formatDate(detailedUser.updatedAt) || 'Chưa cập nhật'}</span>
                </div>
                ${detailedUser.deletedAt ? `
                    <div class="flex justify-between">
                        <span class="text-gray-600">Ngày chặn:</span>
                        <span class="text-red-600">${formatDate(detailedUser.deletedAt)}</span>
                    </div>
                ` : ''}
            </div>
        </div>

        ${detailedUser.role ? `
            <div class="bg-gray-50 rounded-lg p-4">
                <h5 class="font-semibold text-gray-900 mb-3">Thông tin vai trò</h5>
                <div class="space-y-2">
                    <div class="flex justify-between">
                        <span class="text-gray-600">Tên vai trò:</span>
                        <span class="text-gray-900">${detailedUser.role.name}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-600">Mô tả:</span>
                        <span class="text-gray-900">${detailedUser.role.description || 'N/A'}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-600">Ngày tạo vai trò:</span>
                        <span class="text-gray-900">${formatDate(detailedUser.role.createdAt)}</span>
                    </div>
                </div>
            </div>
        ` : ''}
    `;
    
    // Replace loading div with detailed info
    $loadingDiv.html(detailedHtml);
    
    console.log('Modal updated with detailed information');
}

// Show user profile modal (with lazy loading support)
function showUserProfileModal(user, isDetailed = true) {
    console.log('Showing user profile modal for:', user, 'isDetailed:', isDetailed);
    
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
                            ${isDetailed ? `
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
                            ` : `
                                <!-- Loading placeholder for detailed info -->
                                <div class="loading-details bg-gray-50 rounded-lg p-4">
                                    <div class="flex items-center justify-center py-4">
                                        <i class="fas fa-spinner fa-spin text-blue-600 mr-2"></i>
                                        <span class="text-gray-600">Đang tải thông tin chi tiết...</span>
                                    </div>
                                </div>
                            `}
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

// Refresh data (force reload from server)
function refreshData() {
    console.log('Refreshing data from server...');
    isDataLoaded = false;
    cachedUsers = [];
    currentSearchTerm = '';
    currentFilter = '';
    loadUsers();
}

// Get performance stats
function getPerformanceStats() {
    return {
        isDataLoaded: isDataLoaded,
        cachedUsersCount: cachedUsers.length,
        currentSearchTerm: currentSearchTerm,
        currentFilter: currentFilter
    };
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

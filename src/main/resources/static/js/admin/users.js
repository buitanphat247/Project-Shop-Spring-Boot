// =====================================================
// ULTRA-OPTIMIZED USERS MANAGEMENT SYSTEM
// =====================================================

// API Configuration
const API_BASE_URL = '/api/users';

// Performance optimization variables
let searchTimeout;
let isDataLoaded = false;
let cachedUsers = [];
let currentSearchTerm = '';
let currentFilter = '';
let lastRequestTime = 0;
let requestQueue = [];
let isProcessingQueue = false;

// Pagination variables
let currentPage = 0;
let pageSize = 10;
let totalPages = 0;
let totalItems = 0;
let allUsers = []; // Store all users for client-side pagination

// Performance monitoring
const performanceMetrics = {
    loadTimes: [],
    searchTimes: [],
    renderTimes: [],
    cacheHits: 0,
    cacheMisses: 0
};

// Preload critical resources in background
(function() {
    'use strict';
    
    // Preload user data in background using requestIdleCallback
    if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
            preloadUserData();
        });
    } else {
        // Fallback for browsers without requestIdleCallback
        setTimeout(preloadUserData, 100);
    }
    
    // Performance monitoring
    window.addEventListener('load', () => {
        const loadTime = performance.now();
        console.log(`🚀 [PERFORMANCE] Page fully loaded in ${loadTime.toFixed(2)}ms`);
        performanceMetrics.loadTimes.push(loadTime);
    });
})();

// Preload user data for instant access (no session storage)
function preloadUserData() {
    const startTime = performance.now();
    console.log('🔄 [PRELOAD] Starting background data preload...');
    
    // Check if we already have data in memory or if request is already in progress
    if (isDataLoaded && cachedUsers.length > 0) {
        console.log('✅ [PRELOAD] Data already available in memory');
        return;
    }
    
    // Check if request is already in progress
    if (lastRequestTime > 0) {
        console.log('⏳ [PRELOAD] Request already in progress, skipping preload');
        return;
    }
    
    // Set request flag to prevent duplicates
    lastRequestTime = Date.now();
    
    // Fetch data in background with pagination
    fetch(`${API_BASE_URL}?basic=true&page=0&size=10&sort=createdAt&order=desc`, {
        method: 'GET',
        headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
            'X-Request-Type': 'preload'
        }
    })
    .then(response => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
    })
    .then(data => {
        const loadTime = performance.now() - startTime;
        console.log(`✅ [PRELOAD] Data preloaded in ${loadTime.toFixed(2)}ms`);
        
        if (data.success && data.data && data.data.items) {
            // Store in memory only
            allUsers = data.data.items;
            totalItems = data.data.total || data.data.items.length;
            totalPages = Math.ceil(totalItems / pageSize);
            cachedUsers = allUsers.slice(0, pageSize);
            isDataLoaded = true;
            window.usersData = allUsers;
            performanceMetrics.cacheHits++;
        }
    })
    .catch(error => {
        console.log('⚠️ [PRELOAD] Background preload failed:', error.message);
        performanceMetrics.cacheMisses++;
    })
    .finally(() => {
        // Reset request flag after completion
        lastRequestTime = 0;
    });
}

// Wait for jQuery to be ready with enhanced error handling
function initApp() {
    if (typeof $ === 'undefined') {
        console.log('⏳ [INIT] jQuery not loaded yet, retrying...');
        setTimeout(initApp, 50);
        return;
    }

    console.log('✅ [INIT] jQuery ready, setting up event listeners');

    // Load users on page load with priority
    requestAnimationFrame(() => {
        loadUsers();
    });

    // Enhanced debounced search with better performance
    $('input[placeholder="Tìm kiếm người dùng..."]').on('input', function() {
        const searchTerm = $(this).val().trim();
        
        // Clear previous timeout
        clearTimeout(searchTimeout);
        
        // Set new timeout for debounced search (reduced to 150ms)
        searchTimeout = setTimeout(() => {
            if (searchTerm !== currentSearchTerm) {
                currentSearchTerm = searchTerm;
                searchUsers(searchTerm);
            }
        }, 150);
    });

    // Filter functionality with immediate response
    $('select').on('change', function() {
        const filterValue = $(this).val();
        if (filterValue !== currentFilter) {
            currentFilter = filterValue;
            filterUsers(filterValue);
        }
    });

    // Filter button with combined search and filter
    $('button:contains("Lọc")').click(function() {
        const searchTerm = $('input[placeholder="Tìm kiếm người dùng..."]').val().trim();
        const filterValue = $('select').val();
        currentSearchTerm = searchTerm;
        currentFilter = filterValue;
        
        // Use requestAnimationFrame for smooth UI updates
        requestAnimationFrame(() => {
            searchUsers(searchTerm);
            filterUsers(filterValue);
        });
    });
}

// Initialize app when everything is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

// Load users with ULTRA-OPTIMIZED query performance (no session storage)
function loadUsers() {
    const startTime = performance.now();
    console.log('🚀 [LOAD] Starting ultra-optimized user loading...');

    // Check for cached data in memory first
    if (isDataLoaded && allUsers.length > 0) {
        console.log('✅ [MEMORY] Using cached data from memory');
        const loadTime = performance.now() - startTime;
        console.log(`⚡ [MEMORY] Users loaded from memory in ${loadTime.toFixed(2)}ms`);
        performanceMetrics.cacheHits++;
        performanceMetrics.loadTimes.push(loadTime);
        
        // Apply pagination to cached data
        updatePagination();
        const paginatedUsers = getPaginatedUsers();
        
        requestAnimationFrame(() => {
            displayUsers(paginatedUsers);
            updatePaginationControls();
        });
        return;
    }

    // Check if request is already in progress
    if (lastRequestTime > 0) {
        console.log('⏳ [LOAD] Request already in progress, waiting...');
        // Wait for current request to complete
        const checkInterval = setInterval(() => {
            if (lastRequestTime === 0) {
                clearInterval(checkInterval);
                if (isDataLoaded && cachedUsers.length > 0) {
                    displayUsers(cachedUsers);
                } else {
                    loadUsers();
                }
            }
        }, 100);
        return;
    }

    // Show loading state only if not already loaded
    if (!isDataLoaded) {
        showLoadingState();
    }

    // Use optimized fetch with better error handling
    loadUsersOptimized(startTime);
}

// Optimized user loading with advanced performance features
function loadUsersOptimized(startTime) {
    const requestId = Date.now();
    lastRequestTime = requestId;
    
    console.log('🌐 [FETCH] Starting optimized API request...');
    
    // Use fetch with advanced options for better performance
    fetch(`${API_BASE_URL}?basic=true&page=${currentPage}&size=${pageSize}&sort=createdAt&order=desc`, {
        method: 'GET',
        headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
            'X-Request-Time': requestId.toString(),
            'X-Request-Type': 'optimized',
            'Accept': 'application/json'
        },
        // Add request timeout
        signal: AbortSignal.timeout(8000) // 8 seconds timeout
    })
    .then(response => {
        // Check if this is still the latest request
        if (requestId !== lastRequestTime) {
            console.log('⚠️ [FETCH] Request superseded, ignoring response');
            return;
        }
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        return response.json();
    })
    .then(data => {
        // Check if this is still the latest request
        if (requestId !== lastRequestTime) {
            console.log('⚠️ [FETCH] Request superseded, ignoring response');
            return;
        }
        
        const loadTime = performance.now() - startTime;
        console.log(`✅ [FETCH] Users loaded in ${loadTime.toFixed(2)}ms`);
        performanceMetrics.loadTimes.push(loadTime);
        performanceMetrics.cacheMisses++;
        
        if (data.success && data.data && data.data.items && data.data.items.length > 0) {
            console.log('📊 [FETCH] Displaying users with count:', data.data.items.length);
            
            // Cache the data in memory only
            allUsers = data.data.items;
            totalItems = data.data.total || data.data.items.length;
            totalPages = Math.ceil(totalItems / pageSize);
            isDataLoaded = true;
            window.usersData = allUsers;
            
            console.log('💾 [MEMORY] Data cached in memory successfully');
            
            // Apply pagination
            updatePagination();
            const paginatedUsers = getPaginatedUsers();
            
            // Use requestAnimationFrame for smooth rendering
            requestAnimationFrame(() => {
                displayUsers(paginatedUsers);
                updatePaginationControls();
            });
        } else {
            console.log('📭 [FETCH] No users found, showing empty state');
            showEmptyState();
        }
    })
    .catch(error => {
        // Check if this is still the latest request
        if (requestId !== lastRequestTime) {
            console.log('⚠️ [FETCH] Request superseded, ignoring error');
            return;
        }
        
        const loadTime = performance.now() - startTime;
        console.error(`❌ [FETCH] Error loading users after ${loadTime.toFixed(2)}ms:`, error);
        
        if (error.name === 'TimeoutError') {
            showErrorState('Timeout: Không thể tải dữ liệu trong thời gian cho phép');
        } else if (error.message.includes('Failed to fetch')) {
            showErrorState('Lỗi kết nối: Không thể kết nối đến server');
        } else {
            showErrorState(`Lỗi: ${error.message}`);
        }
    })
    .finally(() => {
        // Reset request flag after completion
        lastRequestTime = 0;
    });
}

// Show loading state with better UX
function showLoadingState() {
    const $tbody = $('tbody');
    $tbody.html(`
        <tr>
            <td colspan="6" class="px-6 py-12 text-center">
                <div class="flex flex-col items-center">
                    <div class="relative">
                        <i class="fas fa-spinner fa-spin text-3xl text-blue-600 mb-4"></i>
                    </div>
                    <span class="text-gray-600 text-lg">Đang tải danh sách người dùng...</span>
                    <div class="mt-2 text-sm text-gray-500">Vui lòng chờ trong giây lát</div>
                </div>
            </td>
        </tr>
    `);
}

// Display users in table with ULTRA-OPTIMIZED rendering
function displayUsers(users) {
    const startTime = performance.now();
    console.log('🎨 [RENDER] Starting ultra-optimized table rendering...');
    console.log('📊 [RENDER] Users count:', users.length);

    // Store users data globally for edit/delete functions
    window.usersData = users;

    const $tbody = $('tbody');
    
    // Pre-compute common values for better performance
    const dateFormatter = new Intl.DateTimeFormat('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });

    // Use template literals with pre-computed values for maximum performance
    const htmlString = users.map(user => {
        // Pre-compute all values once
        const isDeleted = !!user.deletedAt;
        const statusClass = isDeleted ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800';
        const statusText = isDeleted ? 'Bị chặn' : 'Hoạt động';
        const roleName = user.role?.name || 'N/A';
        const roleColor = roleName === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800';
        
        // Optimized initials extraction
        const initials = user.name ? 
            user.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : 'U';
        
        // Optimized date formatting
        const joinDate = user.createdAt ? 
            dateFormatter.format(new Date(user.createdAt)) : 'N/A';

        // Pre-escape user data for security
        const safeName = (user.name || 'N/A').replace(/"/g, '&quot;');
        const safeEmail = (user.email || 'N/A').replace(/"/g, '&quot;');
        const safePhone = (user.phone || 'N/A').replace(/"/g, '&quot;');
        const shortId = user.id.substring(0, 8);

        return `<tr class="user-row" data-user-id="${user.id}">
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                    <div class="h-10 w-10 flex-shrink-0">
                        <div class="h-10 w-10 bg-blue-500 rounded-full flex items-center justify-center">
                            <span class="text-white font-medium text-sm">${initials}</span>
                        </div>
                    </div>
                    <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">${safeName}</div>
                        <div class="text-sm text-gray-500">ID: ${shortId}...</div>
                    </div>
                </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${safeEmail}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${safePhone}</td>
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
        </tr>`;
    }).join('');

    // Single DOM operation for maximum performance
    $tbody.html(htmlString);

    const renderTime = performance.now() - startTime;
    console.log(`⚡ [RENDER] Table rendered in ${renderTime.toFixed(2)}ms`);
    performanceMetrics.renderTimes.push(renderTime);

    // Optimized animation with requestAnimationFrame
    requestAnimationFrame(() => {
        animateTableRows($tbody);
    });
}

// Optimized table row animation
function animateTableRows($tbody) {
    const $rows = $tbody.find('tr');
    const totalRows = $rows.length;
    
    // Set initial state
    $rows.css({
        'opacity': '0',
        'transform': 'translateY(20px)',
        'transition': 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
    });

    // Animate rows in optimized batches
    const batchSize = Math.min(10, totalRows);
    let currentBatch = 0;
    
    const animateBatch = () => {
        const startIndex = currentBatch * batchSize;
        const endIndex = Math.min(startIndex + batchSize, totalRows);
        
        for (let i = startIndex; i < endIndex; i++) {
            const $row = $rows.eq(i);
            setTimeout(() => {
                $row.css({
                    'opacity': '1',
                    'transform': 'translateY(0)'
                });
            }, (i - startIndex) * 15); // Reduced delay for faster animation
        }
        
        currentBatch++;
        
        if (endIndex < totalRows) {
            requestAnimationFrame(animateBatch);
        }
    };
    
    requestAnimationFrame(animateBatch);
}

// Search users with ULTRA-OPTIMIZED client-side filtering
function searchUsers(searchTerm) {
    const startTime = performance.now();
    console.log('🔍 [SEARCH] Starting optimized search for:', searchTerm);
    
    if (!searchTerm || searchTerm.trim() === '') {
        // If no search term, show all cached users
        if (isDataLoaded && cachedUsers.length > 0) {
            console.log('📋 [SEARCH] Showing all cached users');
            displayUsers(cachedUsers);
        } else {
            loadUsers();
        }
        return;
    }

    // If data is already loaded, use ultra-optimized client-side filtering
    if (isDataLoaded && allUsers.length > 0) {
        console.log('⚡ [SEARCH] Using ultra-optimized client-side filtering');
        
        const searchLower = searchTerm.toLowerCase().trim();
        const searchLength = searchLower.length;
        
        // Pre-compile search patterns for better performance
        const searchPatterns = searchLower.split(/\s+/).filter(p => p.length > 0);
        
        const filteredUsers = allUsers.filter(user => {
            // Pre-compute lowercase values once
            const name = (user.name || '').toLowerCase();
            const email = (user.email || '').toLowerCase();
            const phone = (user.phone || '').toLowerCase();
            
            // Fast exact match first
            if (name.includes(searchLower) || email.includes(searchLower) || phone.includes(searchLower)) {
                return true;
            }
            
            // Multi-word search optimization
            if (searchPatterns.length > 1) {
                return searchPatterns.every(pattern => 
                    name.includes(pattern) || email.includes(pattern) || phone.includes(pattern)
                );
            }
            
            return false;
        });
        
        const searchTime = performance.now() - startTime;
        console.log(`⚡ [SEARCH] Found ${filteredUsers.length} results in ${searchTime.toFixed(2)}ms`);
        performanceMetrics.searchTimes.push(searchTime);
        
        // Update allUsers with search results and reset pagination
        allUsers = filteredUsers;
        currentPage = 0;
        updatePagination();
        const paginatedUsers = getPaginatedUsers();
        
        requestAnimationFrame(() => {
            displayUsers(paginatedUsers);
            updatePaginationControls();
        });
        return;
    }

    // Fallback to server-side search with optimized request
    searchUsersServer(searchTerm, startTime);
}

// Optimized server-side search
function searchUsersServer(searchTerm, startTime) {
    console.log('🌐 [SEARCH] Using server-side search for:', searchTerm);
    
    const requestId = Date.now();
    lastRequestTime = requestId;
    
    fetch(`${API_BASE_URL}?name=${encodeURIComponent(searchTerm)}&basic=true&limit=1000`, {
        method: 'GET',
        headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
            'X-Request-Time': requestId.toString(),
            'X-Request-Type': 'search',
            'Accept': 'application/json'
        },
        signal: AbortSignal.timeout(6000) // 6 seconds timeout for search
    })
    .then(response => {
        if (requestId !== lastRequestTime) {
            console.log('⚠️ [SEARCH] Request superseded, ignoring response');
            return;
        }
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        return response.json();
    })
    .then(data => {
        if (requestId !== lastRequestTime) {
            console.log('⚠️ [SEARCH] Request superseded, ignoring response');
            return;
        }
        
        const searchTime = performance.now() - startTime;
        console.log(`✅ [SEARCH] Server search completed in ${searchTime.toFixed(2)}ms`);
        performanceMetrics.searchTimes.push(searchTime);
        
        if (data.success && data.data && data.data.items) {
            // Update allUsers with search results and reset pagination
            allUsers = data.data.items;
            totalItems = data.data.total || data.data.items.length;
            currentPage = 0;
            updatePagination();
            const paginatedUsers = getPaginatedUsers();
            
            requestAnimationFrame(() => {
                displayUsers(paginatedUsers);
                updatePaginationControls();
            });
        } else {
            showEmptyState();
        }
    })
    .catch(error => {
        if (requestId !== lastRequestTime) {
            console.log('⚠️ [SEARCH] Request superseded, ignoring error');
            return;
        }
        
        const searchTime = performance.now() - startTime;
        console.error(`❌ [SEARCH] Error after ${searchTime.toFixed(2)}ms:`, error);
        
        if (error.name === 'TimeoutError') {
            showErrorState('Timeout: Tìm kiếm quá lâu');
        } else {
            showErrorState(`Lỗi tìm kiếm: ${error.message}`);
        }
    })
    .finally(() => {
        // Reset request flag after completion
        lastRequestTime = 0;
    });
}

// Filter users by status (optimized)
function filterUsers(filterValue) {
    console.log('Filtering users by:', filterValue);
    
    // Use cached data if available
    const usersToFilter = isDataLoaded ? allUsers : (window.usersData || []);
    
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

    // Update allUsers with filtered results and reset pagination
    allUsers = filteredUsers;
    currentPage = 0;
    updatePagination();
    const paginatedUsers = getPaginatedUsers();
    
    requestAnimationFrame(() => {
        displayUsers(paginatedUsers);
        updatePaginationControls();
    });
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
            timeout: 10000, // Increased to 10 seconds for details
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
    console.log('🔄 [REFRESH] Refreshing data from server...');
    isDataLoaded = false;
    allUsers = [];
    cachedUsers = [];
    currentSearchTerm = '';
    currentFilter = '';
    currentPage = 0;
    totalPages = 0;
    totalItems = 0;
    window.usersData = [];
    loadUsers();
}

// =====================================================
// PAGINATION FUNCTIONS
// =====================================================

// Update pagination info
function updatePagination() {
    totalPages = Math.ceil(allUsers.length / pageSize);
    if (currentPage >= totalPages) {
        currentPage = Math.max(0, totalPages - 1);
    }
}

// Get paginated users for current page
function getPaginatedUsers() {
    const startIndex = currentPage * pageSize;
    const endIndex = startIndex + pageSize;
    return allUsers.slice(startIndex, endIndex);
}

// Go to specific page
function goToPage(page) {
    if (page < 0 || page >= totalPages) return;
    
    currentPage = page;
    const paginatedUsers = getPaginatedUsers();
    
    console.log(`📄 [PAGINATION] Going to page ${page + 1}/${totalPages}`);
    
    requestAnimationFrame(() => {
        displayUsers(paginatedUsers);
        updatePaginationControls();
    });
}

// Go to next page
function nextPage() {
    if (currentPage < totalPages - 1) {
        goToPage(currentPage + 1);
    }
}

// Go to previous page
function previousPage() {
    if (currentPage > 0) {
        goToPage(currentPage - 1);
    }
}

// Go to first page
function firstPage() {
    goToPage(0);
}

// Go to last page
function lastPage() {
    goToPage(totalPages - 1);
}

// Update pagination controls UI
function updatePaginationControls() {
    // Remove existing pagination if any
    $('.pagination-controls').remove();
    
    if (totalPages <= 1) return;
    
    const paginationHtml = `
        <div class="pagination-controls flex items-center justify-between mt-6 px-6 py-4 bg-gray-50 rounded-lg">
            <div class="flex items-center space-x-2">
                <span class="text-sm text-gray-700">
                    Hiển thị ${(currentPage * pageSize) + 1}-${Math.min((currentPage + 1) * pageSize, allUsers.length)} 
                    trong tổng số ${allUsers.length} người dùng
                </span>
            </div>
            
            <div class="flex items-center space-x-2">
                <button onclick="firstPage()" 
                        class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        ${currentPage === 0 ? 'disabled' : ''}>
                    <i class="fas fa-angle-double-left"></i>
                </button>
                
                <button onclick="previousPage()" 
                        class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        ${currentPage === 0 ? 'disabled' : ''}>
                    <i class="fas fa-angle-left"></i>
                </button>
                
                <div class="flex items-center space-x-1">
                    ${generatePageNumbers()}
                </div>
                
                <button onclick="nextPage()" 
                        class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        ${currentPage === totalPages - 1 ? 'disabled' : ''}>
                    <i class="fas fa-angle-right"></i>
                </button>
                
                <button onclick="lastPage()" 
                        class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        ${currentPage === totalPages - 1 ? 'disabled' : ''}>
                    <i class="fas fa-angle-double-right"></i>
                </button>
            </div>
        </div>
    `;
    
    // Insert pagination after table
    $('.overflow-x-auto').after(paginationHtml);
}

// Generate page number buttons
function generatePageNumbers() {
    let pageNumbers = '';
    const maxVisiblePages = 5;
    let startPage = Math.max(0, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);
    
    // Adjust start page if we're near the end
    if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(0, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
        const isActive = i === currentPage;
        pageNumbers += `
            <button onclick="goToPage(${i})" 
                    class="px-3 py-2 text-sm font-medium border rounded-md ${
                        isActive 
                            ? 'bg-blue-600 text-white border-blue-600' 
                            : 'text-gray-500 bg-white border-gray-300 hover:bg-gray-50'
                    }">
                ${i + 1}
            </button>
        `;
    }
    
    return pageNumbers;
}

// =====================================================
// PERFORMANCE MONITORING & OPTIMIZATION UTILITIES
// =====================================================

// Get comprehensive performance stats
function getPerformanceStats() {
    const avgLoadTime = performanceMetrics.loadTimes.length > 0 ? 
        performanceMetrics.loadTimes.reduce((a, b) => a + b, 0) / performanceMetrics.loadTimes.length : 0;
    const avgSearchTime = performanceMetrics.searchTimes.length > 0 ? 
        performanceMetrics.searchTimes.reduce((a, b) => a + b, 0) / performanceMetrics.searchTimes.length : 0;
    const avgRenderTime = performanceMetrics.renderTimes.length > 0 ? 
        performanceMetrics.renderTimes.reduce((a, b) => a + b, 0) / performanceMetrics.renderTimes.length : 0;
    
    return {
        // Current state
        isDataLoaded: isDataLoaded,
        cachedUsersCount: cachedUsers.length,
        currentSearchTerm: currentSearchTerm,
        currentFilter: currentFilter,
        
        // Performance metrics
        performance: {
            avgLoadTime: Math.round(avgLoadTime * 100) / 100,
            avgSearchTime: Math.round(avgSearchTime * 100) / 100,
            avgRenderTime: Math.round(avgRenderTime * 100) / 100,
            cacheHits: performanceMetrics.cacheHits,
            cacheMisses: performanceMetrics.cacheMisses,
            cacheHitRate: performanceMetrics.cacheHits + performanceMetrics.cacheMisses > 0 ? 
                Math.round((performanceMetrics.cacheHits / (performanceMetrics.cacheHits + performanceMetrics.cacheMisses)) * 100) : 0
        },
        
        // Memory usage
        memoryUsage: {
            cachedDataSize: JSON.stringify(cachedUsers).length,
            memoryCacheCount: cachedUsers.length
        }
    };
}

// Clear performance cache and reset metrics (no session storage)
function clearPerformanceCache() {
    console.log('🧹 [MEMORY] Clearing performance cache...');
    
    // Reset state
    isDataLoaded = false;
    cachedUsers = [];
    currentSearchTerm = '';
    currentFilter = '';
    window.usersData = [];
    
    // Reset metrics
    performanceMetrics.loadTimes = [];
    performanceMetrics.searchTimes = [];
    performanceMetrics.renderTimes = [];
    performanceMetrics.cacheHits = 0;
    performanceMetrics.cacheMisses = 0;
    
    console.log('✅ [MEMORY] Performance cache cleared');
}

// Optimize memory usage
function optimizeMemoryUsage() {
    console.log('🔧 [MEMORY] Optimizing memory usage...');
    
    // Clear old performance data
    if (performanceMetrics.loadTimes.length > 50) {
        performanceMetrics.loadTimes = performanceMetrics.loadTimes.slice(-25);
    }
    if (performanceMetrics.searchTimes.length > 50) {
        performanceMetrics.searchTimes = performanceMetrics.searchTimes.slice(-25);
    }
    if (performanceMetrics.renderTimes.length > 50) {
        performanceMetrics.renderTimes = performanceMetrics.renderTimes.slice(-25);
    }
    
    // Force garbage collection if available
    if (window.gc) {
        window.gc();
    }
    
    console.log('✅ [MEMORY] Memory optimization completed');
}

// Export performance stats to console
function exportPerformanceStats() {
    const stats = getPerformanceStats();
    console.group('📊 [PERFORMANCE] User Management System Stats');
    console.log('Current State:', {
        isDataLoaded: stats.isDataLoaded,
        cachedUsersCount: stats.cachedUsersCount,
        currentSearchTerm: stats.currentSearchTerm,
        currentFilter: stats.currentFilter
    });
    console.log('Performance Metrics:', stats.performance);
    console.log('Memory Usage:', stats.memoryUsage);
    console.groupEnd();
    return stats;
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

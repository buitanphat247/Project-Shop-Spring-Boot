// =====================================================
// USER API MODULE - Quản lý API calls cho User
// =====================================================

// API Configuration
const USER_API_BASE_URL = '/api/users';

// Load users from API
function loadUsers(page = 0) {
    // BẮT ĐẦU ĐO THỜI GIAN - Start timing
    const startTime = performance.now();
    console.log(`🚀 [LOAD USERS] Bắt đầu tải người dùng trang ${page}...`, new Date().toLocaleTimeString());

    // Cập nhật current page (sẽ được cập nhật từ API response)
    isUserSearchMode = false;

    // Hiển thị trạng thái loading ngay lập tức
    showUserLoadingState();

    // Timeout 10 giây để tránh treo
    const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Request timeout')), 10000)
    );

    // Cấu hình fetch với headers tối ưu và pagination
    const fetchOptions = {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Cache-Control': 'no-cache',  // Bỏ qua cache browser
            'Pragma': 'no-cache'          // Bỏ qua cache HTTP
        }
    };

    // Thêm pagination parameters
    const url = `${USER_API_BASE_URL}?page=${page}&size=${USER_ITEMS_PER_PAGE}`;

    // Sử dụng Promise.race để timeout
    Promise.race([
        fetch(url, fetchOptions),
        timeoutPromise
    ])
        .then(response => {
            // ĐO THỜI GIAN NHẬN RESPONSE - Measure response time
            const responseTime = performance.now();
            console.log(`⏱️ [LOAD USERS] Nhận response sau: ${(responseTime - startTime).toFixed(2)}ms`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(result => {
            // ĐO THỜI GIAN PARSE JSON - Measure JSON parsing time
            const parseTime = performance.now();
            console.log(`📊 [LOAD USERS] Parse JSON sau: ${(parseTime - startTime).toFixed(2)}ms`);
            console.log('👥 [LOAD USERS] Dữ liệu nhận được:', result);

            if (result.success && result.data && result.data.items && result.data.items.length > 0) {
                console.log(`✅ [LOAD USERS] Tìm thấy ${result.data.items.length} người dùng, bắt đầu hiển thị...`);
                
                // Cập nhật pagination info
                updateUserPaginationData(result.data);
                
                // BẮT ĐẦU HIỂN THỊ TABLE - Start displaying table
                const displayStartTime = performance.now();
                displayUsers(result.data.items);
                
                // Cập nhật pagination UI
                updateUserPaginationUI();
                
                // ĐO THỜI GIAN HOÀN THÀNH HIỂN THỊ - Measure display completion time
                const displayEndTime = performance.now();
                console.log(`🎯 [LOAD USERS] Hoàn thành hiển thị table sau: ${(displayEndTime - displayStartTime).toFixed(2)}ms`);
                console.log(`🏁 [LOAD USERS] TỔNG THỜI GIAN: ${(displayEndTime - startTime).toFixed(2)}ms`);
            } else {
                console.log('❌ [LOAD USERS] Không có người dùng, hiển thị empty state');
                resetUserPagination();
                updateUserPaginationUI();
                showUserEmptyState();
            }
        })
        .catch(error => {
            // ĐO THỜI GIAN LỖI - Measure error time
            const errorTime = performance.now();
            console.error(`💥 [LOAD USERS] Lỗi sau: ${(errorTime - startTime).toFixed(2)}ms`, error);
            showUserErrorState(error.message);
        });
}

// Search users from API
let userSearchTimeout;
function searchUsers(searchTerm, page = 0) {
    // BẮT ĐẦU ĐO THỜI GIAN TÌM KIẾM - Start search timing
    const searchStartTime = performance.now();
    console.log(`🔍 [SEARCH USERS] Bắt đầu tìm kiếm: "${searchTerm}" trang ${page}...`, new Date().toLocaleTimeString());

    // Clear previous timeout để tránh multiple requests
    clearTimeout(userSearchTimeout);

    // Nếu search term rỗng, load tất cả người dùng
    if (!searchTerm) {
        console.log('🔄 [SEARCH USERS] Search term rỗng, load tất cả người dùng');
        isUserSearchMode = false;
        currentUserSearchTerm = '';
        loadUsers(page);
        return;
    }

    // Cập nhật search state
    isUserSearchMode = true;
    currentUserSearchTerm = searchTerm;

    // Debounce 50ms để tránh gọi API quá nhiều lần
    userSearchTimeout = setTimeout(() => {
        console.log(`⏰ [SEARCH USERS] Debounce hoàn thành sau 50ms, bắt đầu search...`);
        
        // Hiển thị loading state ngay lập tức
        showUserLoadingState();

        // Timeout 8 giây cho search request
        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Search timeout')), 8000)
        );

        // Cấu hình fetch với headers tối ưu
        const fetchOptions = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Cache-Control': 'no-cache',  // Bỏ qua cache
                'Pragma': 'no-cache'          // Bỏ qua cache HTTP
            }
        };

        // Gọi API search với pagination
        const searchUrl = `${USER_API_BASE_URL}?name=${encodeURIComponent(searchTerm)}&page=${page}&size=${USER_ITEMS_PER_PAGE}`;
        Promise.race([
            fetch(searchUrl, fetchOptions),
            timeoutPromise
        ])
            .then(response => {
                // ĐO THỜI GIAN NHẬN RESPONSE - Measure response time
                const responseTime = performance.now();
                console.log(`⏱️ [SEARCH USERS] Nhận response sau: ${(responseTime - searchStartTime).toFixed(2)}ms`);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(result => {
                // ĐO THỜI GIAN PARSE JSON - Measure JSON parsing time
                const parseTime = performance.now();
                console.log(`📊 [SEARCH USERS] Parse JSON sau: ${(parseTime - searchStartTime).toFixed(2)}ms`);
                console.log('🔍 [SEARCH USERS] Kết quả tìm kiếm:', result);

                if (result.success && result.data && result.data.items && result.data.items.length > 0) {
                    console.log(`✅ [SEARCH USERS] Tìm thấy ${result.data.items.length} kết quả, bắt đầu hiển thị...`);
                    
                    // Cập nhật pagination info cho search
                    updateUserPaginationData(result.data);
                    
                    // BẮT ĐẦU HIỂN THỊ KẾT QUẢ - Start displaying results
                    const displayStartTime = performance.now();
                    displayUsers(result.data.items);
                    
                    // Cập nhật pagination UI
                    updateUserPaginationUI();
                    
                    // ĐO THỜI GIAN HOÀN THÀNH HIỂN THỊ - Measure display completion time
                    const displayEndTime = performance.now();
                    console.log(`🎯 [SEARCH USERS] Hoàn thành hiển thị kết quả sau: ${(displayEndTime - displayStartTime).toFixed(2)}ms`);
                    console.log(`🏁 [SEARCH USERS] TỔNG THỜI GIAN TÌM KIẾM: ${(displayEndTime - searchStartTime).toFixed(2)}ms`);
                } else {
                    console.log('❌ [SEARCH USERS] Không tìm thấy kết quả, hiển thị empty state');
                    resetUserPagination();
                    updateUserPaginationUI();
                    showUserEmptyState();
                }
            })
            .catch(error => {
                // ĐO THỜI GIAN LỖI - Measure error time
                const errorTime = performance.now();
                console.error(`💥 [SEARCH USERS] Lỗi sau: ${(errorTime - searchStartTime).toFixed(2)}ms`, error);
                showUserErrorState('Lỗi tìm kiếm: ' + error.message);
            });
    }, 50); // 50ms debounce - nhanh hơn 100ms
}

// Delete user via API
function deleteUser(userId) {
    console.log('Delete user:', userId);

    // Find user data
    const user = findUserById(userId);
    if (!user) {
        showUserToast('Không tìm thấy người dùng', 'error');
        return;
    }

    // Show confirmation
    if (!confirm(`Bạn có chắc chắn muốn xóa người dùng "${user.name}"?`)) {
        return;
    }

    // Show loading state on the user row
    const userRow = document.querySelector(`.user-row[data-user-id="${userId}"]`);
    if (userRow) {
        userRow.classList.add('opacity-50');
    }

    // Call delete API
    fetch(`${USER_API_BASE_URL}/${userId}`, {
        method: 'DELETE'
    })
        .then(response => response.json())
        .then(result => {
            console.log('User deleted:', result);
            showUserToast('Xóa người dùng thành công!', 'success');

            // Remove the row with ultra-fast animation
            if (userRow) {
                userRow.style.transition = 'opacity 0.08s ease';
                userRow.style.opacity = '0';
                setTimeout(() => {
                    userRow.remove();
                    // Reload users to ensure data is fresh
                    loadUsers();
                }, 80);
            }
        })
        .catch(error => {
            console.error('Error deleting user:', error);
            if (userRow) {
                userRow.classList.remove('opacity-50');
            }
            showUserToast('Lỗi khi xóa người dùng: ' + error, 'error');
        });
}


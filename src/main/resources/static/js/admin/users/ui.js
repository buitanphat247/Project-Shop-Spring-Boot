// =====================================================
// USER UI MODULE - Quản lý giao diện người dùng cho User
// =====================================================

// Display users in table
function displayUsers(users) {
    // BẮT ĐẦU ĐO THỜI GIAN HIỂN THỊ - Start display timing
    const displayStartTime = performance.now();
    console.log('🎨 [DISPLAY USERS] Bắt đầu hiển thị người dùng...');
    console.log('📊 [DISPLAY USERS] Số lượng người dùng:', users.length);
    console.log('👥 [DISPLAY USERS] Dữ liệu người dùng:', users);

    // Lưu dữ liệu người dùng vào biến global để sử dụng cho edit/delete
    window.usersData = users;

    // Lấy element tbody của table
    const tbody = document.getElementById('usersTableBody');
    if (!tbody) {
        console.error('❌ [DISPLAY USERS] Không tìm thấy tbody element!');
        return;
    }

    // ĐO THỜI GIAN CHUẨN BỊ DỮ LIỆU - Measure data preparation time
    const prepStartTime = performance.now();
    
    // Pre-calculate common values để tối ưu performance
    const roleClasses = {
        'ADMIN': 'bg-red-100 text-red-800',
        'USER': 'bg-blue-100 text-blue-800',
        'MODERATOR': 'bg-green-100 text-green-800'
    };

    const prepEndTime = performance.now();
    console.log(`⚡ [DISPLAY USERS] Chuẩn bị dữ liệu: ${(prepEndTime - prepStartTime).toFixed(2)}ms`);

    // ĐO THỜI GIAN BUILD HTML - Measure HTML building time
    const buildStartTime = performance.now();
    
    // Build HTML string sử dụng map().join() - nhanh hơn innerHTML từng element
    const html = users.map((user, index) => {
        // Xử lý dữ liệu cho từng người dùng
        const roleName = user.role ? user.role.name : 'Không có vai trò';
        const roleClass = roleClasses[roleName] || 'bg-gray-100 text-gray-800';
        const createdAt = formatDate(user.createdAt);
        const lastLogin = user.lastLogin ? formatDate(user.lastLogin) : 'Chưa đăng nhập';

        // Tạo HTML row cho người dùng
        return `
            <tr class="user-row" data-user-id="${user.id}">
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                        <div class="h-12 w-12 flex-shrink-0">
                            <div class="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center">
                                <i class="fas fa-user text-gray-400"></i>
                            </div>
                        </div>
                        <div class="ml-4">
                            <div class="text-sm font-medium text-gray-900">${user.name || 'N/A'}</div>
                            <div class="text-sm text-gray-500">${user.email || 'N/A'}</div>
                        </div>
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${user.phone || 'N/A'}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full ${roleClass}">${roleName}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${createdAt}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${lastLogin}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <span class="text-green-600 hover:text-green-900 cursor-pointer" onclick="showUserViewModal('${user.id}')">
                        <i class="fas fa-eye mr-1"></i>Xem
                    </span>
                </td>
            </tr>
        `;
    }).join('');

    const buildEndTime = performance.now();
    console.log(`🔨 [DISPLAY USERS] Build HTML: ${(buildEndTime - buildStartTime).toFixed(2)}ms`);

    // ĐO THỜI GIAN CẬP NHẬT DOM - Measure DOM update time
    const domStartTime = performance.now();
    
    // Cập nhật DOM một lần duy nhất - tối ưu performance
    tbody.innerHTML = html;
    
    const domEndTime = performance.now();
    console.log(`🌐 [DISPLAY USERS] Cập nhật DOM: ${(domEndTime - domStartTime).toFixed(2)}ms`);

    // ĐO THỜI GIAN HIỂN THỊ UI - Measure UI display time
    const uiStartTime = performance.now();
    
    // Sử dụng requestAnimationFrame để hiển thị mượt mà
    requestAnimationFrame(() => {
        // Hiển thị table và ẩn các state khác
        document.getElementById('usersTable').classList.remove('hidden');
        document.getElementById('userLoadingState').classList.add('hidden');
        document.getElementById('userErrorState').classList.add('hidden');
        document.getElementById('userEmptyState').classList.add('hidden');
        
        // ĐO THỜI GIAN HOÀN THÀNH - Measure completion time
        const uiEndTime = performance.now();
        const totalDisplayTime = uiEndTime - displayStartTime;
        
        console.log(`🎯 [DISPLAY USERS] Hiển thị UI: ${(uiEndTime - uiStartTime).toFixed(2)}ms`);
        console.log(`🏁 [DISPLAY USERS] TỔNG THỜI GIAN HIỂN THỊ: ${totalDisplayTime.toFixed(2)}ms`);
        console.log(`📈 [DISPLAY USERS] Performance breakdown:`);
        console.log(`   - Chuẩn bị dữ liệu: ${(prepEndTime - prepStartTime).toFixed(2)}ms`);
        console.log(`   - Build HTML: ${(buildEndTime - buildStartTime).toFixed(2)}ms`);
        console.log(`   - Cập nhật DOM: ${(domEndTime - domStartTime).toFixed(2)}ms`);
        console.log(`   - Hiển thị UI: ${(uiEndTime - uiStartTime).toFixed(2)}ms`);
        console.log(`✅ [DISPLAY USERS] Hoàn thành hiển thị ${users.length} người dùng!`);
    });
}

// Show user loading state
function showUserLoadingState() {
    const startTime = performance.now();
    console.log('⏳ [USER LOADING STATE] Hiển thị loading state...');
    
    // Sử dụng requestAnimationFrame để hiển thị ngay lập tức
    requestAnimationFrame(() => {
        document.getElementById('userLoadingState').classList.remove('hidden');
        document.getElementById('usersTable').classList.add('hidden');
        document.getElementById('userErrorState').classList.add('hidden');
        document.getElementById('userEmptyState').classList.add('hidden');
        
        const endTime = performance.now();
        console.log(`✅ [USER LOADING STATE] Hoàn thành sau: ${(endTime - startTime).toFixed(2)}ms`);
    });
}

// Show user empty state
function showUserEmptyState() {
    const startTime = performance.now();
    console.log('📭 [USER EMPTY STATE] Hiển thị empty state...');
    
    document.getElementById('userEmptyState').classList.remove('hidden');
    document.getElementById('usersTable').classList.add('hidden');
    document.getElementById('userLoadingState').classList.add('hidden');
    document.getElementById('userErrorState').classList.add('hidden');
    
    const endTime = performance.now();
    console.log(`✅ [USER EMPTY STATE] Hoàn thành sau: ${(endTime - startTime).toFixed(2)}ms`);
}

// Show user error state
function showUserErrorState(errorMessage = 'Không thể tải danh sách người dùng') {
    const startTime = performance.now();
    console.log('❌ [USER ERROR STATE] Hiển thị error state:', errorMessage);
    
    const errorState = document.getElementById('userErrorState');
    const errorText = errorState.querySelector('.error-message');
    
    if (errorText) {
        errorText.textContent = errorMessage;
    }
    
    errorState.classList.remove('hidden');
    document.getElementById('usersTable').classList.add('hidden');
    document.getElementById('userLoadingState').classList.add('hidden');
    document.getElementById('userEmptyState').classList.add('hidden');
    
    const endTime = performance.now();
    console.log(`✅ [USER ERROR STATE] Hoàn thành sau: ${(endTime - startTime).toFixed(2)}ms`);
}

// Format date to Vietnamese format
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (error) {
        console.error('Error formatting date:', error);
        return 'N/A';
    }
}

// Find user by ID
function findUserById(userId) {
    return window.usersData ? window.usersData.find(user => user.id === userId) : null;
}

// Edit user function
function editUser(userId) {
    console.log('Edit user:', userId);

    // Find user data
    const user = findUserById(userId);
    if (!user) {
        showUserToast('Không tìm thấy người dùng', 'error');
        return;
    }

    // TODO: Implement edit user modal
    showUserToast('Chức năng chỉnh sửa người dùng sẽ được triển khai sớm!', 'info');
}

// Show user toast notification with stack effect
function showUserToast(message, type = 'success') {
    const toastId = 'user-toast-' + Date.now();
    const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500';
    const icon = type === 'success' ? 'fas fa-check' : type === 'error' ? 'fas fa-times' : 'fas fa-info';

    // Count existing toasts to calculate position
    const existingToasts = document.querySelectorAll('.user-toast-notification').length;
    const topPosition = 16 + (existingToasts * 80); // 16px base + 80px per toast

    const toastHtml = `
        <div id="${toastId}" class="user-toast-notification fixed right-4 ${bgColor} text-white px-4 py-3 rounded-lg shadow-lg z-50 transform translate-x-full transition-all duration-300 ease-out max-w-sm" style="top: ${topPosition}px;">
            <div class="flex items-center">
                <i class="${icon} mr-2 flex-shrink-0"></i>
                <span class="text-sm">${message}</span>
                <button onclick="closeUserToast('${toastId}')" class="ml-3 text-white hover:text-gray-200 transition-colors">
                    <i class="fas fa-times text-xs"></i>
                </button>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', toastHtml);

    // Show toast with slide-in effect from right (instant)
    requestAnimationFrame(() => {
        const toast = document.getElementById(toastId);
        if (toast) {
            toast.classList.remove('translate-x-full');
            toast.classList.add('translate-x-0');
        }
    });

    // Auto hide after 1.5 seconds (faster)
    setTimeout(() => {
        closeUserToast(toastId);
    }, 1500);
}

// Close specific user toast
function closeUserToast(toastId) {
    const toast = document.getElementById(toastId);
    if (toast) {
        // Slide out to left with opacity fade (ultra-fast)
        toast.classList.add('-translate-x-full', 'opacity-0');
        setTimeout(() => {
            toast.remove();
            // Reposition remaining toasts
            repositionUserToasts();
        }, 50);
    }
}

// Reposition remaining user toasts
function repositionUserToasts() {
    const toasts = document.querySelectorAll('.user-toast-notification');
    toasts.forEach((toast, index) => {
        const newTop = 16 + (index * 80);
        toast.style.top = newTop + 'px';
    });
}

// Show user delete confirmation modal
function showUserDeleteModal(userId) {
    console.log('Show user delete modal for user:', userId);

    // Find user data
    const user = findUserById(userId);
    if (!user) {
        showUserToast('Không tìm thấy người dùng', 'error');
        return;
    }

    // Update modal content with user info
    document.getElementById('userDeleteName').textContent = user.name || 'N/A';
    document.getElementById('userDeleteEmail').textContent = user.email || 'N/A';
    
    // Store user ID for deletion
    document.getElementById('userDeleteModal').setAttribute('data-user-id', userId);

    // Show modal with animation
    const modal = document.getElementById('userDeleteModal');
    modal.classList.remove('hidden');
    
    // Trigger animation
    requestAnimationFrame(() => {
        modal.classList.add('show');
    });
}

// Hide user delete confirmation modal
function hideUserDeleteModal() {
    const modal = document.getElementById('userDeleteModal');
    modal.classList.remove('show');
    
    // Hide modal after animation
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300);
}

// Show user profile modal
function showUserViewModal(userId) {
    console.log('Show user profile modal:', userId);
    
    // Find user data
    const user = findUserById(userId);
    if (!user) {
        showUserToast('Không tìm thấy người dùng', 'error');
        return;
    }

    // Populate modal with user data
    showUserProfileModal(user, true);
}

// Show user profile modal (with lazy loading support)
function showUserProfileModal(user, isDetailed = true) {
    console.log('Showing user profile modal for:', user, 'isDetailed:', isDetailed);
    
    // Populate basic info
    const initials = user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : 'U';
    
    document.getElementById('userInitials').textContent = initials;
    document.getElementById('userDisplayName').textContent = user.name || 'N/A';
    document.getElementById('userDisplayId').textContent = `ID: ${user.id}`;
    document.getElementById('userDisplayEmail').textContent = user.email || 'N/A';
    document.getElementById('userDisplayPhone').textContent = user.phone || 'N/A';
    document.getElementById('userDisplayAddress').textContent = user.address || 'N/A';
    
    if (isDetailed) {
        // Status
        const statusElement = document.getElementById('userStatus');
        const isDeleted = !!user.deletedAt;
        statusElement.textContent = isDeleted ? 'Bị chặn' : 'Hoạt động';
        statusElement.className = `inline-flex px-2 py-1 text-xs font-semibold rounded-full ${isDeleted ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`;
        
        // Role
        const roleElement = document.getElementById('userRole');
        const roleName = user.role ? user.role.name : 'N/A';
        roleElement.textContent = roleName;
        roleElement.className = `inline-flex px-2 py-1 text-xs font-semibold rounded-full ${roleName === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`;
        
        // Dates
        document.getElementById('userCreatedAt').textContent = user.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : 'N/A';
        document.getElementById('userUpdatedAt').textContent = user.updatedAt ? new Date(user.updatedAt).toLocaleDateString('vi-VN') : 'Chưa cập nhật';
        
        // Deleted date
        const deletedContainer = document.getElementById('userDeletedAtContainer');
        if (user.deletedAt) {
            deletedContainer.classList.remove('hidden');
            document.getElementById('userDeletedAt').textContent = new Date(user.deletedAt).toLocaleDateString('vi-VN');
        } else {
            deletedContainer.classList.add('hidden');
        }
        
        // Role info
        const roleInfoContainer = document.getElementById('userRoleInfo');
        if (user.role) {
            roleInfoContainer.classList.remove('hidden');
            document.getElementById('userRoleName').textContent = user.role.name;
            document.getElementById('userRoleDescription').textContent = user.role.description || 'N/A';
            document.getElementById('userRoleCreatedAt').textContent = user.role.createdAt ? new Date(user.role.createdAt).toLocaleDateString('vi-VN') : 'N/A';
        } else {
            roleInfoContainer.classList.add('hidden');
        }
    }

    // Show modal with smooth zoom in
    const $modal = $('#userProfileModal');
    const $content = $modal.find('.transform');
    
    // Show modal immediately
    $modal.removeClass('hidden').show();
    
    // Start from small and transparent
    $content.css({
        'transform': 'scale(0.5)',
        'opacity': '0'
    });
    
    // Smooth zoom in with CSS transition
    setTimeout(function() {
        $content.css({
            'transform': 'scale(1)',
            'opacity': '1'
        });
    }, 10);
}

// Hide user profile modal
function hideUserViewModal() {
    const $modal = $('#userProfileModal');
    const $content = $modal.find('.transform');
    
    // Smooth zoom out
    $content.css({
        'transform': 'scale(0.5)',
        'opacity': '0'
    });
    
    // Hide modal after zoom out
    setTimeout(function() {
        $modal.addClass('hidden').hide();
    }, 300);
}

// Delete user function (called from modal)
function deleteUser(userId) {
    console.log('Delete user:', userId);

    // Find user data
    const user = findUserById(userId);
    if (!user) {
        showUserToast('Không tìm thấy người dùng', 'error');
        return;
    }

    // Hide modal first
    hideUserDeleteModal();

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


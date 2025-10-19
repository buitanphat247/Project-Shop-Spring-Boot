// =====================================================
// USER PAGINATION MODULE - Quản lý phân trang cho User
// =====================================================

// Pagination Configuration
const USER_ITEMS_PER_PAGE = 10;
let currentUserPage = 0; // 0-based để phù hợp với API
let totalUserPages = 1;
let totalUserItems = 0;

// Initialize user pagination UI
function initializeUserPagination() {
    console.log('🔢 [USER PAGINATION] Initializing user pagination UI...');
    
    // Tạo pagination container nếu chưa có
    let paginationContainer = document.getElementById('userPaginationContainer');
    if (!paginationContainer) {
        paginationContainer = document.createElement('div');
        paginationContainer.id = 'userPaginationContainer';
        paginationContainer.className = 'mt-6 px-6 py-4 bg-gray-50 rounded-lg';
        
        // Thêm pagination container vào sau table
        const usersTable = document.getElementById('usersTable');
        if (usersTable) {
            usersTable.parentNode.insertBefore(paginationContainer, usersTable.nextSibling);
        }
    }
    
    updateUserPaginationUI();
}

// Update user pagination UI
function updateUserPaginationUI() {
    const paginationContainer = document.getElementById('userPaginationContainer');
    if (!paginationContainer) {
        console.error('❌ [USER PAGINATION] Pagination container not found!');
        return;
    }
    
    // Ẩn pagination nếu không có dữ liệu
    if (totalUserItems === 0) {
        paginationContainer.classList.add('hidden');
        return;
    }
    
    // Hiển thị pagination
    paginationContainer.classList.remove('hidden');
    
    // Tính toán thông tin pagination (currentPage bắt đầu từ 0 trong API)
    const apiPage = currentUserPage; // currentPage từ API response
    const startItem = apiPage * USER_ITEMS_PER_PAGE + 1;
    const endItem = Math.min((apiPage + 1) * USER_ITEMS_PER_PAGE, totalUserItems);
    
    // Tạo pagination HTML với Tailwind CSS
    const paginationHTML = `
        <div class="flex items-center justify-between">
            <div class="text-sm text-gray-600">
                Hiển thị ${startItem}-${endItem} trong tổng số ${totalUserItems} người dùng
            </div>
            
            <div class="flex items-center space-x-2">
                <!-- First Page Button -->
                <button 
                    onclick="goToUserPage(0)" 
                    class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    ${currentUserPage <= 0 ? 'disabled' : ''}
                    title="Về trang đầu"
                >
                    <i class="fas fa-angle-double-left"></i>
                </button>
                
                <!-- Previous Button -->
                <button 
                    onclick="goToUserPage(${currentUserPage - 1})" 
                    class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    ${currentUserPage <= 0 ? 'disabled' : ''}
                    title="Trang trước"
                >
                    <i class="fas fa-angle-left"></i>
                </button>
                
                <!-- Page Numbers -->
                <div class="flex items-center space-x-1">
                    ${generateUserPageNumbers()}
                </div>
                
                <!-- Next Button -->
                <button 
                    onclick="goToUserPage(${currentUserPage + 1})" 
                    class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    ${currentUserPage >= totalUserPages - 1 ? 'disabled' : ''}
                    title="Trang sau"
                >
                    <i class="fas fa-angle-right"></i>
                </button>
                
                <!-- Last Page Button -->
                <button 
                    onclick="goToUserPage(${totalUserPages - 1})" 
                    class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    ${currentUserPage >= totalUserPages - 1 ? 'disabled' : ''}
                    title="Về trang cuối"
                >
                    <i class="fas fa-angle-double-right"></i>
                </button>
            </div>
        </div>
    `;
    
    paginationContainer.innerHTML = paginationHTML;
    
    console.log(`🔢 [USER PAGINATION] Updated UI - Page ${currentUserPage + 1}/${totalUserPages}, Items ${startItem}-${endItem}/${totalUserItems}`);
}

// Generate user page numbers with smart pagination (0-based API, 1-based UI)
function generateUserPageNumbers() {
    const maxVisiblePages = 5;
    // Convert 0-based currentPage to 1-based for display
    const displayCurrentPage = currentUserPage + 1;
    let startPage = Math.max(1, displayCurrentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalUserPages, startPage + maxVisiblePages - 1);
    
    // Adjust start page if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    let pageNumbers = '';
    
    // First page + ellipsis
    if (startPage > 1) {
        pageNumbers += createUserPageButton(1);
        if (startPage > 2) {
            pageNumbers += '<span class="px-2 py-1 text-gray-500">...</span>';
        }
    }
    
    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
        pageNumbers += createUserPageButton(i);
    }
    
    // Ellipsis + last page
    if (endPage < totalUserPages) {
        if (endPage < totalUserPages - 1) {
            pageNumbers += '<span class="px-2 py-1 text-gray-500">...</span>';
        }
        pageNumbers += createUserPageButton(totalUserPages);
    }
    
    return pageNumbers;
}

// Create user page button HTML (convert 1-based display to 0-based API)
function createUserPageButton(pageNumber) {
    const isActive = pageNumber === (currentUserPage + 1); // Convert 0-based to 1-based for comparison
    const activeClass = isActive 
        ? 'bg-blue-600 text-white border-blue-600' 
        : 'text-gray-500 bg-white border-gray-300 hover:bg-gray-50';
    
    return `
        <button 
            onclick="goToUserPage(${pageNumber - 1})" 
            class="px-3 py-2 text-sm font-medium border rounded-md ${activeClass}"
        >
            ${pageNumber}
        </button>
    `;
}

// Go to specific user page (0-based API) - INSTANT UI UPDATE
function goToUserPage(page) {
    if (page < 0 || page >= totalUserPages || page === currentUserPage) {
        return;
    }
    
    console.log(`🔢 [USER PAGINATION] Going to page ${page + 1} (API page ${page})`);
    
    // CẬP NHẬT UI NGAY LẬP TỨC - Update UI immediately
    currentUserPage = page;
    updateUserPaginationUI();
    
    // Hiển thị loading state ngay lập tức
    showUserLoadingState();
    
    // Gọi API sau khi UI đã được cập nhật
    if (isUserSearchMode && currentUserSearchTerm) {
        searchUsers(currentUserSearchTerm, page);
    } else {
        loadUsers(page);
    }
}

// Go to next user page
function nextUserPage() {
    if (currentUserPage < totalUserPages - 1) {
        goToUserPage(currentUserPage + 1);
    }
}

// Go to previous user page
function prevUserPage() {
    if (currentUserPage > 0) {
        goToUserPage(currentUserPage - 1);
    }
}

// Go to first user page
function firstUserPage() {
    goToUserPage(0);
}

// Go to last user page
function lastUserPage() {
    goToUserPage(totalUserPages - 1);
}

// Update user pagination data from API response
function updateUserPaginationData(data) {
    totalUserItems = data.total || data.items.length;
    totalUserPages = data.totalPages || Math.ceil(totalUserItems / USER_ITEMS_PER_PAGE);
    // Chỉ cập nhật currentPage từ API khi load lần đầu (không phải từ goToPage)
    if (typeof data.currentPage === 'number') {
        currentUserPage = data.currentPage;
    }
}

// Reset user pagination to first page
function resetUserPagination() {
    currentUserPage = 0;
    totalUserItems = 0;
    totalUserPages = 1;
}

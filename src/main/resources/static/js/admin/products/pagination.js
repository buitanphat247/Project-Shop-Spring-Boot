// =====================================================
// PAGINATION MODULE - Quản lý phân trang
// =====================================================

// Pagination Configuration
const ITEMS_PER_PAGE = 10;
let currentPage = 0; // 0-based để phù hợp với API
let totalPages = 1;
let totalItems = 0;

// Initialize pagination UI
function initializePagination() {
    console.log('🔢 [PAGINATION] Initializing pagination UI...');
    
    // Tạo pagination container nếu chưa có
    let paginationContainer = document.getElementById('paginationContainer');
    if (!paginationContainer) {
        paginationContainer = document.createElement('div');
        paginationContainer.id = 'paginationContainer';
        paginationContainer.className = 'mt-6 px-6 py-4 bg-gray-50 rounded-lg';
        
        // Thêm pagination container vào sau table
        const productsTable = document.getElementById('productsTable');
        if (productsTable) {
            productsTable.parentNode.insertBefore(paginationContainer, productsTable.nextSibling);
        }
    }
    
    updatePaginationUI();
}

// Update pagination UI
function updatePaginationUI() {
    const paginationContainer = document.getElementById('paginationContainer');
    if (!paginationContainer) {
        console.error('❌ [PAGINATION] Pagination container not found!');
        return;
    }
    
    // Ẩn pagination nếu không có dữ liệu
    if (totalItems === 0) {
        paginationContainer.classList.add('hidden');
        return;
    }
    
    // Hiển thị pagination
    paginationContainer.classList.remove('hidden');
    
    // Tính toán thông tin pagination (currentPage bắt đầu từ 0 trong API)
    const apiPage = currentPage; // currentPage từ API response
    const startItem = apiPage * ITEMS_PER_PAGE + 1;
    const endItem = Math.min((apiPage + 1) * ITEMS_PER_PAGE, totalItems);
    
    // Tạo pagination HTML với Tailwind CSS
    const paginationHTML = `
        <div class="flex items-center justify-between">
            <div class="text-sm text-gray-600">
                Hiển thị ${startItem}-${endItem} trong tổng số ${totalItems} sản phẩm
            </div>
            
            <div class="flex items-center space-x-2">
                <!-- First Page Button -->
                <button 
                    onclick="goToPage(0)" 
                    class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    ${currentPage <= 0 ? 'disabled' : ''}
                    title="Về trang đầu"
                >
                    <i class="fas fa-angle-double-left"></i>
                </button>
                
                <!-- Previous Button -->
                <button 
                    onclick="goToPage(${currentPage - 1})" 
                    class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    ${currentPage <= 0 ? 'disabled' : ''}
                    title="Trang trước"
                >
                    <i class="fas fa-angle-left"></i>
                </button>
                
                <!-- Page Numbers -->
                <div class="flex items-center space-x-1">
                    ${generatePageNumbers()}
                </div>
                
                <!-- Next Button -->
                <button 
                    onclick="goToPage(${currentPage + 1})" 
                    class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    ${currentPage >= totalPages - 1 ? 'disabled' : ''}
                    title="Trang sau"
                >
                    <i class="fas fa-angle-right"></i>
                </button>
                
                <!-- Last Page Button -->
                <button 
                    onclick="goToPage(${totalPages - 1})" 
                    class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    ${currentPage >= totalPages - 1 ? 'disabled' : ''}
                    title="Về trang cuối"
                >
                    <i class="fas fa-angle-double-right"></i>
                </button>
            </div>
        </div>
    `;
    
    paginationContainer.innerHTML = paginationHTML;
    
    console.log(`🔢 [PAGINATION] Updated UI - Page ${currentPage + 1}/${totalPages}, Items ${startItem}-${endItem}/${totalItems}`);
}

// Generate page numbers with smart pagination (0-based API, 1-based UI)
function generatePageNumbers() {
    const maxVisiblePages = 5;
    // Convert 0-based currentPage to 1-based for display
    const displayCurrentPage = currentPage + 1;
    let startPage = Math.max(1, displayCurrentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    // Adjust start page if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    let pageNumbers = '';
    
    // First page + ellipsis
    if (startPage > 1) {
        pageNumbers += createPageButton(1);
        if (startPage > 2) {
            pageNumbers += '<span class="px-2 py-1 text-gray-500">...</span>';
        }
    }
    
    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
        pageNumbers += createPageButton(i);
    }
    
    // Ellipsis + last page
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            pageNumbers += '<span class="px-2 py-1 text-gray-500">...</span>';
        }
        pageNumbers += createPageButton(totalPages);
    }
    
    return pageNumbers;
}

// Create page button HTML (convert 1-based display to 0-based API)
function createPageButton(pageNumber) {
    const isActive = pageNumber === (currentPage + 1); // Convert 0-based to 1-based for comparison
    const activeClass = isActive 
        ? 'bg-blue-600 text-white border-blue-600' 
        : 'text-gray-500 bg-white border-gray-300 hover:bg-gray-50';
    
    return `
        <button 
            onclick="goToPage(${pageNumber - 1})" 
            class="px-3 py-2 text-sm font-medium border rounded-md ${activeClass}"
        >
            ${pageNumber}
        </button>
    `;
}

// Go to specific page (0-based API) - INSTANT UI UPDATE
function goToPage(page) {
    if (page < 0 || page >= totalPages || page === currentPage) {
        return;
    }
    
    console.log(`🔢 [PAGINATION] Going to page ${page + 1} (API page ${page})`);
    
    // CẬP NHẬT UI NGAY LẬP TỨC - Update UI immediately
    currentPage = page;
    updatePaginationUI();
    
    // Cập nhật URL với tham số page
    updateURL(page);
    
    // Hiển thị loading state ngay lập tức
    showLoadingState();
    
    // Gọi API sau khi UI đã được cập nhật
    if (isSearchMode && currentSearchTerm) {
        searchProducts(currentSearchTerm, page);
    } else {
        loadProducts(page);
    }
}

// Go to next page
function nextPage() {
    if (currentPage < totalPages - 1) {
        goToPage(currentPage + 1);
    }
}

// Go to previous page
function prevPage() {
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

// Update pagination data from API response
function updatePaginationData(data) {
    totalItems = data.total || data.items.length;
    totalPages = data.totalPages || Math.ceil(totalItems / ITEMS_PER_PAGE);
    // Chỉ cập nhật currentPage từ API khi load lần đầu (không phải từ goToPage)
    if (typeof data.currentPage === 'number') {
        currentPage = data.currentPage;
    }
}

// Reset pagination to first page
function resetPagination() {
    currentPage = 0;
    totalItems = 0;
    totalPages = 1;
    // Update URL to page 0 when resetting
    updateURL(0);
}

// Update URL with page parameter
function updateURL(page) {
    const url = new URL(window.location);
    if (page > 0) {
        url.searchParams.set('page', page);
    } else {
        url.searchParams.delete('page');
    }
    
    // Update URL without reloading page
    window.history.replaceState({}, '', url);
    console.log(`🔢 [PAGINATION] Updated URL to: ${url.toString()}`);
}

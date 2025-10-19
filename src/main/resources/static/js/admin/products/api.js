// =====================================================
// API MODULE - Quản lý API calls
// =====================================================

// API Configuration
const API_BASE_URL = '/api/products';

// Load products from API
function loadProducts(page = 0) {
    // BẮT ĐẦU ĐO THỜI GIAN - Start timing
    const startTime = performance.now();
    console.log(`🚀 [LOAD PRODUCTS] Bắt đầu tải sản phẩm trang ${page}...`, new Date().toLocaleTimeString());

    // Cập nhật current page (sẽ được cập nhật từ API response)
    isSearchMode = false;

    // Hiển thị trạng thái loading ngay lập tức
    showLoadingState();

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
    const url = `${API_BASE_URL}?page=${page}&size=${ITEMS_PER_PAGE}`;

    // Sử dụng Promise.race để timeout
    Promise.race([
        fetch(url, fetchOptions),
        timeoutPromise
    ])
        .then(response => {
            // ĐO THỜI GIAN NHẬN RESPONSE - Measure response time
            const responseTime = performance.now();
            console.log(`⏱️ [LOAD PRODUCTS] Nhận response sau: ${(responseTime - startTime).toFixed(2)}ms`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(result => {
            // ĐO THỜI GIAN PARSE JSON - Measure JSON parsing time
            const parseTime = performance.now();
            console.log(`📊 [LOAD PRODUCTS] Parse JSON sau: ${(parseTime - startTime).toFixed(2)}ms`);
            console.log('📦 [LOAD PRODUCTS] Dữ liệu nhận được:', result);

            if (result.success && result.data && result.data.items && result.data.items.length > 0) {
                console.log(`✅ [LOAD PRODUCTS] Tìm thấy ${result.data.items.length} sản phẩm, bắt đầu hiển thị...`);
                
                // Cập nhật pagination info
                updatePaginationData(result.data);
                
                // BẮT ĐẦU HIỂN THỊ TABLE - Start displaying table
                const displayStartTime = performance.now();
                displayProducts(result.data.items);
                
                // Cập nhật pagination UI
                updatePaginationUI();
                
                // ĐO THỜI GIAN HOÀN THÀNH HIỂN THỊ - Measure display completion time
                const displayEndTime = performance.now();
                console.log(`🎯 [LOAD PRODUCTS] Hoàn thành hiển thị table sau: ${(displayEndTime - displayStartTime).toFixed(2)}ms`);
                console.log(`🏁 [LOAD PRODUCTS] TỔNG THỜI GIAN: ${(displayEndTime - startTime).toFixed(2)}ms`);
            } else {
                console.log('❌ [LOAD PRODUCTS] Không có sản phẩm, hiển thị empty state');
                resetPagination();
                updatePaginationUI();
                showEmptyState();
            }
        })
        .catch(error => {
            // ĐO THỜI GIAN LỖI - Measure error time
            const errorTime = performance.now();
            console.error(`💥 [LOAD PRODUCTS] Lỗi sau: ${(errorTime - startTime).toFixed(2)}ms`, error);
            showErrorState(error.message);
        });
}

// Search products from API
let searchTimeout;
function searchProducts(searchTerm, page = 0) {
    // BẮT ĐẦU ĐO THỜI GIAN TÌM KIẾM - Start search timing
    const searchStartTime = performance.now();
    console.log(`🔍 [SEARCH PRODUCTS] Bắt đầu tìm kiếm: "${searchTerm}" trang ${page}...`, new Date().toLocaleTimeString());

    // Clear previous timeout để tránh multiple requests
    clearTimeout(searchTimeout);

    // Nếu search term rỗng, load tất cả sản phẩm
    if (!searchTerm) {
        console.log('🔄 [SEARCH PRODUCTS] Search term rỗng, load tất cả sản phẩm');
        isSearchMode = false;
        currentSearchTerm = '';
        loadProducts(page);
        return;
    }

    // Cập nhật search state
    isSearchMode = true;
    currentSearchTerm = searchTerm;

    // Debounce 50ms để tránh gọi API quá nhiều lần
    searchTimeout = setTimeout(() => {
        console.log(`⏰ [SEARCH PRODUCTS] Debounce hoàn thành sau 50ms, bắt đầu search...`);
        
        // Hiển thị loading state ngay lập tức
        showLoadingState();

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
        const searchUrl = `${API_BASE_URL}/search?name=${encodeURIComponent(searchTerm)}&page=${page}&size=${ITEMS_PER_PAGE}`;
        Promise.race([
            fetch(searchUrl, fetchOptions),
            timeoutPromise
        ])
            .then(response => {
                // ĐO THỜI GIAN NHẬN RESPONSE - Measure response time
                const responseTime = performance.now();
                console.log(`⏱️ [SEARCH PRODUCTS] Nhận response sau: ${(responseTime - searchStartTime).toFixed(2)}ms`);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(result => {
                // ĐO THỜI GIAN PARSE JSON - Measure JSON parsing time
                const parseTime = performance.now();
                console.log(`📊 [SEARCH PRODUCTS] Parse JSON sau: ${(parseTime - searchStartTime).toFixed(2)}ms`);
                console.log('🔍 [SEARCH PRODUCTS] Kết quả tìm kiếm:', result);

                if (result.success && result.data && result.data.items && result.data.items.length > 0) {
                    console.log(`✅ [SEARCH PRODUCTS] Tìm thấy ${result.data.items.length} kết quả, bắt đầu hiển thị...`);
                    
                    // Cập nhật pagination info cho search
                    updatePaginationData(result.data);
                    
                    // BẮT ĐẦU HIỂN THỊ KẾT QUẢ - Start displaying results
                    const displayStartTime = performance.now();
                    displayProducts(result.data.items);
                    
                    // Cập nhật pagination UI
                    updatePaginationUI();
                    
                    // ĐO THỜI GIAN HOÀN THÀNH HIỂN THỊ - Measure display completion time
                    const displayEndTime = performance.now();
                    console.log(`🎯 [SEARCH PRODUCTS] Hoàn thành hiển thị kết quả sau: ${(displayEndTime - displayStartTime).toFixed(2)}ms`);
                    console.log(`🏁 [SEARCH PRODUCTS] TỔNG THỜI GIAN TÌM KIẾM: ${(displayEndTime - searchStartTime).toFixed(2)}ms`);
                } else {
                    console.log('❌ [SEARCH PRODUCTS] Không tìm thấy kết quả, hiển thị empty state');
                    resetPagination();
                    updatePaginationUI();
                    showEmptyState();
                }
            })
            .catch(error => {
                // ĐO THỜI GIAN LỖI - Measure error time
                const errorTime = performance.now();
                console.error(`💥 [SEARCH PRODUCTS] Lỗi sau: ${(errorTime - searchStartTime).toFixed(2)}ms`, error);
                showErrorState('Lỗi tìm kiếm: ' + error.message);
            });
    }, 50); // 50ms debounce - nhanh hơn 100ms
}

// Delete product via API
function deleteProduct(productId) {
    console.log('Delete product:', productId);

    // Find product data
    const product = findProductById(productId);
    if (!product) {
        showToast('Không tìm thấy sản phẩm', 'error');
        return;
    }

    // Show confirmation
    if (!confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${product.name}"?`)) {
        return;
    }

    // Show loading state on the product row
    const productRow = document.querySelector(`.product-row[data-product-id="${productId}"]`);
    if (productRow) {
        productRow.classList.add('opacity-50');
    }

    // Call delete API
    fetch(`${API_BASE_URL}/${productId}`, {
        method: 'DELETE'
    })
        .then(response => response.json())
        .then(result => {
            console.log('Product deleted:', result);
            showToast('Xóa sản phẩm thành công!', 'success');

            // Remove the row with ultra-fast animation
            if (productRow) {
                productRow.style.transition = 'opacity 0.08s ease';
                productRow.style.opacity = '0';
                setTimeout(() => {
                    productRow.remove();
                    // Reload products to ensure data is fresh
                    loadProducts();
                }, 80);
            }
        })
        .catch(error => {
            console.error('Error deleting product:', error);
            if (productRow) {
                productRow.classList.remove('opacity-50');
            }
            showToast('Lỗi khi xóa sản phẩm: ' + error, 'error');
        });
}

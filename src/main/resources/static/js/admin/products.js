// API Configuration
const API_BASE_URL = '/api/products';

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM ready, initializing products app');

    // Load products on page load
    loadProducts();

    // Search functionality
    const searchInput = document.querySelector('input[placeholder="Tìm kiếm sản phẩm..."]');
    if (searchInput) {
        searchInput.addEventListener('input', function () {
            const searchTerm = this.value.trim();
            console.log('Searching for:', searchTerm);
            searchProducts(searchTerm);
        });
    }

    // Retry button
    const retryBtn = document.getElementById('retryLoad');
    if (retryBtn) {
        retryBtn.addEventListener('click', function (e) {
            e.preventDefault();
            console.log('Retry button clicked');
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
});

// =====================================================
// LOAD PRODUCTS - Tải danh sách sản phẩm
// =====================================================
// Chức năng: Gọi API để lấy danh sách sản phẩm từ server
// Tối ưu: Sử dụng Promise.race để timeout, headers cache-control
// Debug: Đo thời gian từ lúc bắt đầu đến khi hiển thị table
function loadProducts() {
    // BẮT ĐẦU ĐO THỜI GIAN - Start timing
    const startTime = performance.now();
    console.log('🚀 [LOAD PRODUCTS] Bắt đầu tải sản phẩm...', new Date().toLocaleTimeString());

    // Hiển thị trạng thái loading ngay lập tức
    showLoadingState();

    // Timeout 10 giây để tránh treo
    const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Request timeout')), 10000)
    );

    // Cấu hình fetch với headers tối ưu
    const fetchOptions = {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Cache-Control': 'no-cache',  // Bỏ qua cache browser
            'Pragma': 'no-cache'          // Bỏ qua cache HTTP
        }
    };

    // Sử dụng Promise.race để timeout
    Promise.race([
        fetch(API_BASE_URL, fetchOptions),
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
                
                // BẮT ĐẦU HIỂN THỊ TABLE - Start displaying table
                const displayStartTime = performance.now();
                displayProducts(result.data.items);
                
                // ĐO THỜI GIAN HOÀN THÀNH HIỂN THỊ - Measure display completion time
                const displayEndTime = performance.now();
                console.log(`🎯 [LOAD PRODUCTS] Hoàn thành hiển thị table sau: ${(displayEndTime - displayStartTime).toFixed(2)}ms`);
                console.log(`🏁 [LOAD PRODUCTS] TỔNG THỜI GIAN: ${(displayEndTime - startTime).toFixed(2)}ms`);
            } else {
                console.log('❌ [LOAD PRODUCTS] Không có sản phẩm, hiển thị empty state');
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

// =====================================================
// SEARCH PRODUCTS - Tìm kiếm sản phẩm
// =====================================================
// Chức năng: Tìm kiếm sản phẩm theo tên với debouncing
// Tối ưu: Debounce 50ms, timeout 8s, cache-control headers
// Debug: Đo thời gian tìm kiếm và hiển thị kết quả
let searchTimeout;
function searchProducts(searchTerm) {
    // BẮT ĐẦU ĐO THỜI GIAN TÌM KIẾM - Start search timing
    const searchStartTime = performance.now();
    console.log('🔍 [SEARCH PRODUCTS] Bắt đầu tìm kiếm:', searchTerm, new Date().toLocaleTimeString());

    // Clear previous timeout để tránh multiple requests
    clearTimeout(searchTimeout);

    // Nếu search term rỗng, load tất cả sản phẩm
    if (!searchTerm) {
        console.log('🔄 [SEARCH PRODUCTS] Search term rỗng, load tất cả sản phẩm');
        loadProducts();
        return;
    }

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

        // Gọi API search với Promise.race để timeout
        Promise.race([
            fetch(`${API_BASE_URL}/search?name=${encodeURIComponent(searchTerm)}`, fetchOptions),
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

                if (result.success && result.data && result.data.length > 0) {
                    console.log(`✅ [SEARCH PRODUCTS] Tìm thấy ${result.data.length} kết quả, bắt đầu hiển thị...`);
                    
                    // BẮT ĐẦU HIỂN THỊ KẾT QUẢ - Start displaying results
                    const displayStartTime = performance.now();
                    displayProducts(result.data);
                    
                    // ĐO THỜI GIAN HOÀN THÀNH HIỂN THỊ - Measure display completion time
                    const displayEndTime = performance.now();
                    console.log(`🎯 [SEARCH PRODUCTS] Hoàn thành hiển thị kết quả sau: ${(displayEndTime - displayStartTime).toFixed(2)}ms`);
                    console.log(`🏁 [SEARCH PRODUCTS] TỔNG THỜI GIAN TÌM KIẾM: ${(displayEndTime - searchStartTime).toFixed(2)}ms`);
                } else {
                    console.log('❌ [SEARCH PRODUCTS] Không tìm thấy kết quả, hiển thị empty state');
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

// =====================================================
// DISPLAY PRODUCTS - Hiển thị sản phẩm trong table
// =====================================================
// Chức năng: Render danh sách sản phẩm vào HTML table
// Tối ưu: Sử dụng DocumentFragment, map().join(), requestAnimationFrame
// Debug: Đo thời gian từng bước xử lý và render
function displayProducts(products) {
    // BẮT ĐẦU ĐO THỜI GIAN HIỂN THỊ - Start display timing
    const displayStartTime = performance.now();
    console.log('🎨 [DISPLAY PRODUCTS] Bắt đầu hiển thị sản phẩm...');
    console.log('📊 [DISPLAY PRODUCTS] Số lượng sản phẩm:', products.length);
    console.log('📦 [DISPLAY PRODUCTS] Dữ liệu sản phẩm:', products);

    // Lưu dữ liệu sản phẩm vào biến global để sử dụng cho edit/delete
    window.productsData = products;

    // Lấy element tbody của table
    const tbody = document.getElementById('productsTableBody');
    if (!tbody) {
        console.error('❌ [DISPLAY PRODUCTS] Không tìm thấy tbody element!');
        return;
    }

    // ĐO THỜI GIAN CHUẨN BỊ DỮ LIỆU - Measure data preparation time
    const prepStartTime = performance.now();
    
    // Pre-calculate common values để tối ưu performance
    const statusClasses = {
        inStock: 'bg-green-100 text-green-800',
        outOfStock: 'bg-red-100 text-red-800'
    };
    const statusTexts = {
        inStock: 'Còn hàng',
        outOfStock: 'Hết hàng'
    };

    const prepEndTime = performance.now();
    console.log(`⚡ [DISPLAY PRODUCTS] Chuẩn bị dữ liệu: ${(prepEndTime - prepStartTime).toFixed(2)}ms`);

    // ĐO THỜI GIAN BUILD HTML - Measure HTML building time
    const buildStartTime = performance.now();
    
    // Build HTML string sử dụng map().join() - nhanh hơn innerHTML từng element
    const html = products.map((product, index) => {
        // Xử lý dữ liệu cho từng sản phẩm
        const isInStock = product.stock > 0;
        const statusClass = isInStock ? statusClasses.inStock : statusClasses.outOfStock;
        const statusText = isInStock ? statusTexts.inStock : statusTexts.outOfStock;
        const price = formatPrice(product.price);
        const categoryName = product.category ? product.category.name : 'Không có danh mục';

        // Tạo HTML row cho sản phẩm
        return `
            <tr class="product-row" data-product-id="${product.id}">
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                        <div class="h-12 w-12 flex-shrink-0">
                            <div class="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center">
                                <i class="fas fa-box text-gray-400"></i>
                            </div>
                        </div>
                        <div class="ml-4">
                            <div class="text-sm font-medium text-gray-900">${product.name}</div>
                            <div class="text-sm text-gray-500">${categoryName}</div>
                        </div>
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${price}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${product.stock}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusClass}">${statusText}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button class="text-blue-600 hover:text-blue-900 mr-3" onclick="editProduct('${product.id}')">
                        <i class="fas fa-edit mr-1"></i>Sửa
                    </button>
                    <button class="text-red-600 hover:text-red-900" onclick="deleteProduct('${product.id}')">
                        <i class="fas fa-trash mr-1"></i>Xóa
                    </button>
                </td>
            </tr>
        `;
    }).join('');

    const buildEndTime = performance.now();
    console.log(`🔨 [DISPLAY PRODUCTS] Build HTML: ${(buildEndTime - buildStartTime).toFixed(2)}ms`);

    // ĐO THỜI GIAN CẬP NHẬT DOM - Measure DOM update time
    const domStartTime = performance.now();
    
    // Cập nhật DOM một lần duy nhất - tối ưu performance
    tbody.innerHTML = html;
    
    const domEndTime = performance.now();
    console.log(`🌐 [DISPLAY PRODUCTS] Cập nhật DOM: ${(domEndTime - domStartTime).toFixed(2)}ms`);

    // ĐO THỜI GIAN HIỂN THỊ UI - Measure UI display time
    const uiStartTime = performance.now();
    
    // Sử dụng requestAnimationFrame để hiển thị mượt mà
    requestAnimationFrame(() => {
        // Hiển thị table và ẩn các state khác
        document.getElementById('productsTable').classList.remove('hidden');
        document.getElementById('loadingState').classList.add('hidden');
        document.getElementById('errorState').classList.add('hidden');
        document.getElementById('emptyState').classList.add('hidden');
        
        // ĐO THỜI GIAN HOÀN THÀNH - Measure completion time
        const uiEndTime = performance.now();
        const totalDisplayTime = uiEndTime - displayStartTime;
        
        console.log(`🎯 [DISPLAY PRODUCTS] Hiển thị UI: ${(uiEndTime - uiStartTime).toFixed(2)}ms`);
        console.log(`🏁 [DISPLAY PRODUCTS] TỔNG THỜI GIAN HIỂN THỊ: ${totalDisplayTime.toFixed(2)}ms`);
        console.log(`📈 [DISPLAY PRODUCTS] Performance breakdown:`);
        console.log(`   - Chuẩn bị dữ liệu: ${(prepEndTime - prepStartTime).toFixed(2)}ms`);
        console.log(`   - Build HTML: ${(buildEndTime - buildStartTime).toFixed(2)}ms`);
        console.log(`   - Cập nhật DOM: ${(domEndTime - domStartTime).toFixed(2)}ms`);
        console.log(`   - Hiển thị UI: ${(uiEndTime - uiStartTime).toFixed(2)}ms`);
        console.log(`✅ [DISPLAY PRODUCTS] Hoàn thành hiển thị ${products.length} sản phẩm!`);
    });
}

// =====================================================
// SHOW LOADING STATE - Hiển thị trạng thái đang tải
// =====================================================
// Chức năng: Hiển thị loading spinner và ẩn các state khác
// Tối ưu: Sử dụng requestAnimationFrame để hiển thị ngay lập tức
function showLoadingState() {
    const startTime = performance.now();
    console.log('⏳ [LOADING STATE] Hiển thị loading state...');
    
    // Sử dụng requestAnimationFrame để hiển thị ngay lập tức
    requestAnimationFrame(() => {
        document.getElementById('loadingState').classList.remove('hidden');
        document.getElementById('productsTable').classList.add('hidden');
        document.getElementById('errorState').classList.add('hidden');
        document.getElementById('emptyState').classList.add('hidden');
        
        const endTime = performance.now();
        console.log(`✅ [LOADING STATE] Hoàn thành sau: ${(endTime - startTime).toFixed(2)}ms`);
    });
}

// =====================================================
// SHOW EMPTY STATE - Hiển thị trạng thái rỗng
// =====================================================
// Chức năng: Hiển thị thông báo không có sản phẩm
function showEmptyState() {
    const startTime = performance.now();
    console.log('📭 [EMPTY STATE] Hiển thị empty state...');
    
    document.getElementById('emptyState').classList.remove('hidden');
    document.getElementById('productsTable').classList.add('hidden');
    document.getElementById('loadingState').classList.add('hidden');
    document.getElementById('errorState').classList.add('hidden');
    
    const endTime = performance.now();
    console.log(`✅ [EMPTY STATE] Hoàn thành sau: ${(endTime - startTime).toFixed(2)}ms`);
}

// =====================================================
// SHOW ERROR STATE - Hiển thị trạng thái lỗi
// =====================================================
// Chức năng: Hiển thị thông báo lỗi với message tùy chỉnh
function showErrorState(errorMessage = 'Không thể tải danh sách sản phẩm') {
    const startTime = performance.now();
    console.log('❌ [ERROR STATE] Hiển thị error state:', errorMessage);
    
    const errorState = document.getElementById('errorState');
    const errorText = errorState.querySelector('.error-message');
    
    if (errorText) {
        errorText.textContent = errorMessage;
    }
    
    errorState.classList.remove('hidden');
    document.getElementById('productsTable').classList.add('hidden');
    document.getElementById('loadingState').classList.add('hidden');
    document.getElementById('emptyState').classList.add('hidden');
    
    const endTime = performance.now();
    console.log(`✅ [ERROR STATE] Hoàn thành sau: ${(endTime - startTime).toFixed(2)}ms`);
}

// Format price to Vietnamese currency
function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(price);
}

// Edit product function
function editProduct(productId) {
    console.log('Edit product:', productId);

    // Find product data
    const product = findProductById(productId);
    if (!product) {
        showToast('Không tìm thấy sản phẩm', 'error');
        return;
    }

    // TODO: Implement edit product modal
    showToast('Chức năng chỉnh sửa sản phẩm sẽ được triển khai sớm!', 'info');
}

// Find product by ID
function findProductById(productId) {
    return window.productsData ? window.productsData.find(prod => prod.id === productId) : null;
}

// Delete product function
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

// =====================================================
// IMAGE UPLOAD WITH PROGRESS - Upload ảnh với thanh tiến trình
// =====================================================
// Chức năng: Upload ảnh với hiển thị tiến trình % real-time
// Tối ưu: Sử dụng XMLHttpRequest để track progress, multiple files support
// Debug: Log chi tiết từng bước upload và progress

// Global variables for upload tracking
let uploadProgress = {
    totalFiles: 0,
    completedFiles: 0,
    currentFile: 0,
    isUploading: false
};

// Upload single image with progress
function uploadImageWithProgress(file, onProgress, onSuccess, onError) {
    const startTime = performance.now();
    console.log('📤 [UPLOAD] Starting upload for file:', file.name, 'Size:', file.size);
    
    const formData = new FormData();
    formData.append('image', file);
    
    const xhr = new XMLHttpRequest();
    
    // Track upload progress
    xhr.upload.addEventListener('progress', function(e) {
        if (e.lengthComputable) {
            const percentComplete = Math.round((e.loaded / e.total) * 100);
            console.log(`📊 [UPLOAD] Progress: ${percentComplete}% (${e.loaded}/${e.total} bytes)`);
            
            if (onProgress) {
                onProgress(percentComplete, e.loaded, e.total);
            }
        }
    });
    
    // Handle upload completion
    xhr.addEventListener('load', function() {
        const endTime = performance.now();
        console.log(`✅ [UPLOAD] Upload completed in ${(endTime - startTime).toFixed(2)}ms`);
        
        if (xhr.status === 200) {
            try {
                const response = JSON.parse(xhr.responseText);
                if (response.success) {
                    console.log('🎉 [UPLOAD] Upload successful:', response.data);
                    if (onSuccess) onSuccess(response.data);
                } else {
                    console.error('❌ [UPLOAD] Upload failed:', response.message);
                    if (onError) onError(response.message);
                }
            } catch (e) {
                console.error('❌ [UPLOAD] Parse response error:', e);
                if (onError) onError('Lỗi xử lý response');
            }
        } else {
            console.error('❌ [UPLOAD] HTTP error:', xhr.status);
            if (onError) onError(`HTTP error: ${xhr.status}`);
        }
    });
    
    // Handle upload error
    xhr.addEventListener('error', function() {
        const endTime = performance.now();
        console.error(`💥 [UPLOAD] Upload failed after ${(endTime - startTime).toFixed(2)}ms`);
        if (onError) onError('Lỗi kết nối');
    });
    
    // Handle upload timeout
    xhr.addEventListener('timeout', function() {
        console.error('⏰ [UPLOAD] Upload timeout');
        if (onError) onError('Upload timeout');
    });
    
    // Configure request
    xhr.open('POST', '/api/cloudinary');
    xhr.timeout = 30000; // 30 seconds timeout
    
    // Start upload
    xhr.send(formData);
}

// Upload multiple images with overall progress
function uploadMultipleImagesWithProgress(files, onOverallProgress, onFileProgress, onComplete, onError) {
    if (!files || files.length === 0) {
        console.error('❌ [MULTI UPLOAD] No files provided');
        if (onError) onError('Không có file nào được chọn');
        return;
    }
    
    // Initialize progress tracking
    uploadProgress = {
        totalFiles: files.length,
        completedFiles: 0,
        currentFile: 0,
        isUploading: true
    };
    
    console.log(`🚀 [MULTI UPLOAD] Starting upload of ${files.length} files`);
    
    const results = [];
    let hasError = false;
    
    // Upload files sequentially to avoid overwhelming the server
    function uploadNextFile(index) {
        if (index >= files.length) {
            // All files uploaded
            uploadProgress.isUploading = false;
            console.log(`✅ [MULTI UPLOAD] All files uploaded: ${results.length} successful`);
            if (onComplete) onComplete(results);
            return;
        }
        
        const file = files[index];
        uploadProgress.currentFile = index + 1;
        
        console.log(`📤 [MULTI UPLOAD] Uploading file ${index + 1}/${files.length}: ${file.name}`);
        
        // Update overall progress
        const overallProgress = Math.round((uploadProgress.completedFiles / uploadProgress.totalFiles) * 100);
        if (onOverallProgress) {
            onOverallProgress(overallProgress, uploadProgress.completedFiles, uploadProgress.totalFiles);
        }
        
        uploadImageWithProgress(
            file,
            // File progress callback
            (percent, loaded, total) => {
                if (onFileProgress) {
                    onFileProgress(index + 1, file.name, percent, loaded, total);
                }
            },
            // Success callback
            (data) => {
                results.push(data);
                uploadProgress.completedFiles++;
                console.log(`✅ [MULTI UPLOAD] File ${index + 1} uploaded successfully`);
                
                // Upload next file
                uploadNextFile(index + 1);
            },
            // Error callback
            (error) => {
                console.error(`❌ [MULTI UPLOAD] File ${index + 1} upload failed:`, error);
                hasError = true;
                uploadProgress.isUploading = false;
                if (onError) onError(`Lỗi upload file ${file.name}: ${error}`);
            }
        );
    }
    
    // Start uploading first file
    uploadNextFile(0);
}

// Show upload progress modal
function showUploadProgressModal() {
    // Create progress modal if not exists
    let modal = document.getElementById('uploadProgressModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'uploadProgressModal';
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 hidden';
        modal.innerHTML = `
            <div class="bg-white rounded-lg p-6 w-96 max-w-full mx-4">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-lg font-semibold text-gray-900">Đang upload ảnh...</h3>
                    <button onclick="hideUploadProgressModal()" class="text-gray-400 hover:text-gray-600">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <!-- Overall Progress -->
                <div class="mb-4">
                    <div class="flex justify-between text-sm text-gray-600 mb-2">
                        <span>Tổng tiến trình</span>
                        <span id="overallProgressText">0/0 files</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2">
                        <div id="overallProgressBar" class="bg-blue-600 h-2 rounded-full transition-all duration-300" style="width: 0%"></div>
                    </div>
                </div>
                
                <!-- Current File Progress -->
                <div class="mb-4">
                    <div class="flex justify-between text-sm text-gray-600 mb-2">
                        <span id="currentFileName">Đang chuẩn bị...</span>
                        <span id="currentFileProgressText">0%</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2">
                        <div id="currentFileProgressBar" class="bg-green-600 h-2 rounded-full transition-all duration-300" style="width: 0%"></div>
                    </div>
                </div>
                
                <!-- Upload Speed -->
                <div class="text-xs text-gray-500">
                    <div>Tốc độ: <span id="uploadSpeed">0 KB/s</span></div>
                    <div>Đã upload: <span id="uploadedSize">0 KB</span> / <span id="totalSize">0 KB</span></div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }
    
    // Show modal
    modal.classList.remove('hidden');
}

// Hide upload progress modal
function hideUploadProgressModal() {
    const modal = document.getElementById('uploadProgressModal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

// Update overall progress
function updateOverallProgress(percent, completed, total) {
    const progressBar = document.getElementById('overallProgressBar');
    const progressText = document.getElementById('overallProgressText');
    
    if (progressBar) {
        progressBar.style.width = percent + '%';
    }
    if (progressText) {
        progressText.textContent = `${completed}/${total} files`;
    }
}

// Update current file progress
function updateCurrentFileProgress(fileNumber, fileName, percent, loaded, total) {
    const fileNameEl = document.getElementById('currentFileName');
    const progressBar = document.getElementById('currentFileProgressBar');
    const progressText = document.getElementById('currentFileProgressText');
    const uploadSpeed = document.getElementById('uploadSpeed');
    const uploadedSize = document.getElementById('uploadedSize');
    const totalSize = document.getElementById('totalSize');
    
    if (fileNameEl) {
        fileNameEl.textContent = `File ${fileNumber}: ${fileName}`;
    }
    if (progressBar) {
        progressBar.style.width = percent + '%';
    }
    if (progressText) {
        progressText.textContent = percent + '%';
    }
    if (uploadedSize) {
        uploadedSize.textContent = formatBytes(loaded);
    }
    if (totalSize) {
        totalSize.textContent = formatBytes(total);
    }
    if (uploadSpeed) {
        // Calculate speed (simplified)
        const speed = loaded > 0 ? (loaded / 1024).toFixed(1) : '0';
        uploadSpeed.textContent = speed + ' KB/s';
    }
}

// Format bytes to human readable
function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Example usage function for product creation form
function handleImageUploadWithProgress(inputElement) {
    const files = inputElement.files;
    if (!files || files.length === 0) {
        showToast('Vui lòng chọn ít nhất một file ảnh', 'error');
        return;
    }
    
    console.log(`📤 [HANDLE UPLOAD] Starting upload of ${files.length} files`);
    
    // Show progress modal
    showUploadProgressModal();
    
    // Upload files with progress tracking
    uploadMultipleImagesWithProgress(
        Array.from(files),
        // Overall progress callback
        (percent, completed, total) => {
            updateOverallProgress(percent, completed, total);
        },
        // File progress callback
        (fileNumber, fileName, percent, loaded, total) => {
            updateCurrentFileProgress(fileNumber, fileName, percent, loaded, total);
        },
        // Complete callback
        (results) => {
            console.log('🎉 [HANDLE UPLOAD] All uploads completed:', results);
            hideUploadProgressModal();
            showToast(`Upload thành công ${results.length} ảnh!`, 'success');
            
            // Process results (e.g., save to form data)
            processUploadedImages(results);
        },
        // Error callback
        (error) => {
            console.error('💥 [HANDLE UPLOAD] Upload failed:', error);
            hideUploadProgressModal();
            showToast('Upload thất bại: ' + error, 'error');
        }
    );
}

// Process uploaded images (customize based on your needs)
function processUploadedImages(imageData) {
    console.log('🖼️ [PROCESS IMAGES] Processing uploaded images:', imageData);
    
    // Example: Store image URLs in form data
    imageData.forEach((img, index) => {
        console.log(`Image ${index + 1}:`, img.url);
        // Add your custom logic here
    });
}

// Show toast notification with stack effect
function showToast(message, type = 'success') {
    const toastId = 'toast-' + Date.now();
    const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500';
    const icon = type === 'success' ? 'fas fa-check' : type === 'error' ? 'fas fa-times' : 'fas fa-info';

    // Count existing toasts to calculate position
    const existingToasts = document.querySelectorAll('.toast-notification').length;
    const topPosition = 16 + (existingToasts * 80); // 16px base + 80px per toast

    const toastHtml = `
        <div id="${toastId}" class="toast-notification fixed right-4 ${bgColor} text-white px-4 py-3 rounded-lg shadow-lg z-50 transform translate-x-full transition-all duration-300 ease-out max-w-sm" style="top: ${topPosition}px;">
            <div class="flex items-center">
                <i class="${icon} mr-2 flex-shrink-0"></i>
                <span class="text-sm">${message}</span>
                <button onclick="closeToast('${toastId}')" class="ml-3 text-white hover:text-gray-200 transition-colors">
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
        closeToast(toastId);
    }, 1500);
}

// Close specific toast
function closeToast(toastId) {
    const toast = document.getElementById(toastId);
    if (toast) {
        // Slide out to left with opacity fade (ultra-fast)
        toast.classList.add('-translate-x-full', 'opacity-0');
        setTimeout(() => {
            toast.remove();
            // Reposition remaining toasts
            repositionToasts();
        }, 50);
    }
}

// Reposition remaining toasts
function repositionToasts() {
    const toasts = document.querySelectorAll('.toast-notification');
    toasts.forEach((toast, index) => {
        const newTop = 16 + (index * 80);
        toast.style.top = newTop + 'px';
    });
}
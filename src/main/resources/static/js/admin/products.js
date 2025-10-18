// API Configuration
const API_BASE_URL = '/api/products';

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM ready, initializing products app');
    
    // Load products on page load
    loadProducts();

    // Search functionality
    const searchInput = document.querySelector('input[placeholder="Tìm kiếm sản phẩm..."]');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.trim();
            console.log('Searching for:', searchTerm);
            searchProducts(searchTerm);
        });
    }

    // Retry button
    const retryBtn = document.getElementById('retryLoad');
    if (retryBtn) {
        retryBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Retry button clicked');
            loadProducts();
        });
    }

    // Add first product button
    const addFirstBtn = document.getElementById('addFirstProduct');
    if (addFirstBtn) {
        addFirstBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Add first product clicked - redirecting to create page');
            window.location.href = '/admin/products/create';
        });
    }
});

// Load products with fetch API
function loadProducts() {
    console.log('Loading products...');
    
    // Show loading state
    showLoadingState();
    
    fetch(API_BASE_URL)
        .then(response => response.json())
        .then(result => {
            console.log('Products loaded:', result);
            
            if (result.success && result.data && result.data.items && result.data.items.length > 0) {
                console.log('Displaying products with count:', result.data.items.length);
                displayProducts(result.data.items);
            } else {
                console.log('No products found, showing empty state');
                showEmptyState();
            }
        })
        .catch(error => {
            console.error('Error loading products:', error);
            showErrorState();
        });
}

// Search products
function searchProducts(searchTerm) {
    console.log('Searching products for:', searchTerm);
    
    if (!searchTerm) {
        loadProducts();
        return;
    }
    
    // Show loading state
    showLoadingState();
    
    fetch(`${API_BASE_URL}/search?name=${encodeURIComponent(searchTerm)}`)
        .then(response => response.json())
        .then(result => {
            console.log('Search results:', result);
            
            if (result.success && result.data && result.data.length > 0) {
                console.log('Displaying search results with count:', result.data.length);
                displayProducts(result.data);
            } else {
                console.log('No search results found');
                showEmptyState();
            }
        })
        .catch(error => {
            console.error('Error searching products:', error);
            showErrorState();
        });
}

// Display products in table
function displayProducts(products) {
    console.log('Displaying products:', products);
    console.log('Products count:', products.length);
    
    // Store products data globally for edit/delete functions
    window.productsData = products;
    
    const tbody = document.getElementById('productsTableBody');
    let html = '';
    
    products.forEach(function(product, index) {
        const statusClass = product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
        const statusText = product.stock > 0 ? 'Còn hàng' : 'Hết hàng';
        const price = formatPrice(product.price);
        
        html += `
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
                            <div class="text-sm text-gray-500">${product.category ? product.category.name : 'Không có danh mục'}</div>
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
    });
    
    tbody.innerHTML = html;
    
    // Show table and hide other states
    document.getElementById('productsTable').classList.remove('hidden');
    document.getElementById('loadingState').classList.add('hidden');
    document.getElementById('errorState').classList.add('hidden');
    document.getElementById('emptyState').classList.add('hidden');
}

// Show loading state
function showLoadingState() {
    document.getElementById('loadingState').classList.remove('hidden');
    document.getElementById('productsTable').classList.add('hidden');
    document.getElementById('errorState').classList.add('hidden');
    document.getElementById('emptyState').classList.add('hidden');
}

// Show empty state
function showEmptyState() {
    document.getElementById('emptyState').classList.remove('hidden');
    document.getElementById('productsTable').classList.add('hidden');
    document.getElementById('loadingState').classList.add('hidden');
    document.getElementById('errorState').classList.add('hidden');
}

// Show error state
function showErrorState() {
    document.getElementById('errorState').classList.remove('hidden');
    document.getElementById('productsTable').classList.add('hidden');
    document.getElementById('loadingState').classList.add('hidden');
    document.getElementById('emptyState').classList.add('hidden');
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
        
        // Remove the row with animation
        if (productRow) {
            productRow.style.transition = 'opacity 0.3s ease';
            productRow.style.opacity = '0';
            setTimeout(() => {
                productRow.remove();
                // Reload products to ensure data is fresh
                loadProducts();
            }, 300);
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

// Image upload functions removed - no longer needed

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
    
    // Show toast with slide-in effect from right
    setTimeout(() => {
        const toast = document.getElementById(toastId);
        if (toast) {
            toast.classList.remove('translate-x-full');
            toast.classList.add('translate-x-0');
        }
    }, 30);
    
    // Auto hide after 2.5 seconds
    setTimeout(() => {
        closeToast(toastId);
    }, 2500);
}

// Close specific toast
function closeToast(toastId) {
    const toast = document.getElementById(toastId);
    if (toast) {
        // Slide out to left with opacity fade
        toast.classList.add('-translate-x-full', 'opacity-0');
        setTimeout(() => {
            toast.remove();
            // Reposition remaining toasts
            repositionToasts();
        }, 150);
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
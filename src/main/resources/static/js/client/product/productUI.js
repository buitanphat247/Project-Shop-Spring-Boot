// Product UI Module
class ProductUI {
    constructor() {
        this.currentPage = 1;
        this.totalPages = 1;
        this.totalItems = 0;
        this.pageSize = 12;
    }

    /**
     * Hiển thị loading state
     */
    showLoading() {
        const productGrid = document.getElementById('product-grid');
        if (!productGrid) return;
        
        productGrid.innerHTML = `
            <div class="col-span-full flex justify-center items-center py-12">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2f604a]"></div>
            </div>
        `;
        
        // Ẩn pagination khi đang loading
        this.setPaginationVisibility(false);
    }

    /**
     * Ẩn loading state
     */
    hideLoading() {
        // Loading sẽ được thay thế bởi displayProducts
    }

    /**
     * Hiển thị sản phẩm
     * @param {Array} products - Danh sách sản phẩm
     */
    displayProducts(products) {
        const productGrid = document.getElementById('product-grid');
        if (!productGrid) return;
        
        // Lưu danh sách sản phẩm vào global variable để sử dụng trong gallery
        window.currentProducts = products;
        
        if (!products || products.length === 0) {
            productGrid.innerHTML = `
                <div class="col-span-full text-center py-12">
                    <i class="fas fa-box-open text-6xl text-gray-300 mb-4"></i>
                    <h3 class="text-xl font-semibold text-gray-600 mb-2">Không có sản phẩm nào</h3>
                    <p class="text-gray-500">Hãy thử lại sau hoặc kiểm tra danh mục khác</p>
                </div>
            `;
            return;
        }
        
        productGrid.innerHTML = products.map(product => this.createProductCard(product)).join('');
    }

    /**
     * Tạo card sản phẩm
     * @param {Object} product - Sản phẩm
     * @returns {string} - HTML card sản phẩm
     */
    createProductCard(product) {
        const price = ProductUtils.formatPrice(product.price);
        const imageUrl = ProductUtils.getProductImage(product);
        
        return `
            <a href="/products/detail/${product.id}" class="block" id="product-${product.id}">
                <div class="product-card bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden group">
                    <div class="relative overflow-hidden">
                        <img src="${imageUrl}" 
                             alt="${product.name}" 
                             class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                             onclick="event.preventDefault(); window.ProductGallery.openImageGallery('${product.id}', '${product.name}')">
                        <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
                        <div class="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <button class="w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center text-gray-600 hover:text-red-500"
                                    onclick="event.preventDefault(); event.stopPropagation(); this.addToWishlist('${product.id}', '${product.name}')">
                                <i class="fas fa-heart text-sm"></i>
                            </button>
                        </div>
                        ${product.allImages && product.allImages.length > 1 ? `
                            <div class="absolute bottom-3 right-3 bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-xs">
                                <i class="fas fa-images mr-1"></i>
                                ${product.allImages.length}
                            </div>
                        ` : ''}
                    </div>
                    
                    <div class="p-4 flex flex-col justify-between">
                        <div>
                            <h3 class="font-semibold text-gray-900 mb-2 line-clamp-1" title="${product.name}">
                                ${product.name}
                            </h3>
                            
                            <div class="flex items-center justify-between mb-3">
                                <span class="text-lg font-bold text-[#cb5439]">${price}</span>
                                <span class="text-sm text-gray-500">Còn ${product.stock} sản phẩm</span>
                            </div>
                            
                            <div class="flex items-center gap-2 mb-3">
                                <div class="flex text-yellow-400">
                                    ${ProductUtils.generateStars(4.5)}
                                </div>
                                <span class="text-sm text-gray-500">(24 đánh giá)</span>
                            </div>
                        </div>
                        
                        <div>
                            <button class="add-to-cart-btn w-full bg-[#2f604a] text-white py-2 px-4 rounded-lg font-medium hover:bg-[#1e4a3a] transition-all duration-300"
                                    onclick="event.preventDefault(); event.stopPropagation(); this.addToCart('${product.id}', '${product.name}', ${product.price})">
                                <i class="fas fa-shopping-cart mr-2"></i>
                                Thêm vào giỏ
                            </button>
                        </div>
                    </div>
                </div>
            </a>
        `;
    }

    /**
     * Cập nhật phân trang
     * @param {Object} data - Dữ liệu phân trang
     */
    updatePagination(data) {
        this.currentPage = data.currentPage;
        this.totalPages = data.totalPages;
        this.totalItems = data.total;
        
        this.updatePaginationUI();
    }

    /**
     * Cập nhật UI pagination ngay lập tức
     */
    updatePaginationUI() {
        let paginationContainer = document.querySelector('.mt-8.flex.items-center.justify-center.gap-2');
        
        // Nếu pagination container không tồn tại, tạo mới
        if (!paginationContainer) {
            const contentSection = document.querySelector('section.lg\\:col-span-9');
            if (contentSection) {
                paginationContainer = document.createElement('div');
                paginationContainer.className = 'mt-8 flex items-center justify-center gap-2';
                contentSection.appendChild(paginationContainer);
            } else {
                console.error('Cannot find content section for pagination');
                return;
            }
        }
        
        if (this.totalPages <= 1) {
            paginationContainer.innerHTML = '';
            return;
        }
        
        let paginationHTML = '';
        
        // Nút Previous
        paginationHTML += `
            <button onclick="goToPage(${this.currentPage - 1})" 
                    ${this.currentPage === 1 ? 'disabled' : ''}
                    class="min-w-9 h-9 px-3 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                &laquo;
            </button>
        `;
        
        // Số trang
        const startPage = Math.max(1, this.currentPage - 2);
        const endPage = Math.min(this.totalPages, this.currentPage + 2);
        
        for (let i = startPage; i <= endPage; i++) {
            paginationHTML += `
                <button onclick="goToPage(${i})" 
                        class="min-w-9 h-9 px-3 rounded-md border border-gray-300 ${i === this.currentPage ? 'bg-[#cb5439] text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}">
                    ${i}
                </button>
            `;
        }
        
        // Nút Next
        paginationHTML += `
            <button onclick="goToPage(${this.currentPage + 1})" 
                    ${this.currentPage === this.totalPages ? 'disabled' : ''}
                    class="min-w-9 h-9 px-3 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                &raquo;
            </button>
        `;
        
        paginationContainer.innerHTML = paginationHTML;
    }

    /**
     * Cập nhật số lượng sản phẩm hiển thị
     * @param {Object} data - Dữ liệu phân trang
     */
    updateProductCount(data) {
        const countElement = document.querySelector('.text-sm.text-gray-700');
        if (!countElement) return;
        
        const startItem = (data.currentPage - 1) * data.size + 1;
        const endItem = Math.min(data.currentPage * data.size, data.total);
        
        countElement.textContent = `Hiển thị ${startItem}–${endItem} của ${data.total} kết quả`;
    }

    /**
     * Chuyển trang
     * @param {number} page - Số trang
     */
    goToPage(page) {
        if (page < 1 || page > this.totalPages || page === this.currentPage) {
            return;
        }
        
        // Cập nhật currentPage ngay lập tức
        this.currentPage = page;
        
        // Cập nhật UI pagination ngay lập tức
        this.updatePaginationUI();
        
        // Hiển thị loading state
        this.showPaginationLoading();
        
        // Load sản phẩm mới
        if (window.productManager) {
            window.productManager.loadProducts(this.currentPage);
        }
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    /**
     * Hiển thị loading state cho pagination
     */
    showPaginationLoading() {
        const paginationContainer = document.querySelector('.mt-8.flex.items-center.justify-center.gap-2');
        if (!paginationContainer) return;
        
        // Thêm loading class cho nút hiện tại
        const currentButton = paginationContainer.querySelector(`button[onclick="goToPage(${this.currentPage})"]`);
        if (currentButton) {
            currentButton.innerHTML = `
                <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mx-auto"></div>
            `;
            currentButton.disabled = true;
            currentButton.classList.add('opacity-75');
        }
        
        // Disable tất cả nút pagination
        const allButtons = paginationContainer.querySelectorAll('button');
        allButtons.forEach(button => {
            if (button !== currentButton) {
                button.disabled = true;
                button.classList.add('opacity-50');
            }
        });
    }

    /**
     * Ẩn loading state cho pagination
     */
    hidePaginationLoading() {
        const paginationContainer = document.querySelector('.mt-8.flex.items-center.justify-center.gap-2');
        if (!paginationContainer) return;
        
        // Enable lại tất cả nút pagination
        const allButtons = paginationContainer.querySelectorAll('button');
        allButtons.forEach(button => {
            button.disabled = false;
            button.classList.remove('opacity-50', 'opacity-75');
        });
        
        // Restore nút hiện tại
        const currentButton = paginationContainer.querySelector(`button[onclick="goToPage(${this.currentPage})"]`);
        if (currentButton) {
            currentButton.innerHTML = this.currentPage.toString();
        }
    }

    /**
     * Điều khiển hiển thị/ẩn pagination
     * @param {boolean} isVisible - Hiển thị hay ẩn
     */
    setPaginationVisibility(isVisible) {
        const paginationContainer = document.querySelector('.mt-8.flex.items-center.justify-center.gap-2');
        if (paginationContainer) {
            paginationContainer.style.display = isVisible ? 'flex' : 'none';
        }
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Sort dropdown
        const sortSelect = document.querySelector('select');
        if (sortSelect) {
            sortSelect.addEventListener('change', function() {
                // TODO: Implement sorting
                console.log('Sort by:', this.value);
            });
        }
        
        // Category filters
        const categoryLinks = document.querySelectorAll('aside ul li a');
        categoryLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                // TODO: Implement category filtering
                console.log('Filter by category:', this.textContent);
            });
        });
    }
}

// Export cho ES6 modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProductUI;
} else {
    window.ProductUI = ProductUI;
}

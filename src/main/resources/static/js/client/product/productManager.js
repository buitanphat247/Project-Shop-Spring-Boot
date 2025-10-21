// Product Manager Module - Main controller
class ProductManager {
    constructor() {
        this.api = new ProductApi();
        this.ui = new ProductUI();
        this.gallery = new ProductGallery();
        this.currentPage = this.ui.currentPage; // Lấy trang từ URL
        this.pageSize = 12;
    }

    /**
     * Khởi tạo Product Manager
     */
    init() {
        this.loadProducts(this.currentPage);
        this.ui.setupEventListeners();
        this.setupGlobalFunctions();
        
        // Khởi tạo cart count nếu chưa có
        this.initCartCount();
    }

    /**
     * Khởi tạo cart count
     */
    initCartCount() {
        // Chỉ khởi tạo nếu cart count manager chưa có
        if (!window.cartCountManager) {
            console.log('Cart count manager not found, initializing manually...');
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            this.updateCartCount(cart.length);
        } else {
            console.log('Cart count manager found, using existing instance...');
        }
    }

    /**
     * Load sản phẩm từ API
     * @param {number} page - Số trang
     */
    async loadProducts(page = 1) {
        try {
            this.ui.showLoading();
            
            // Cập nhật currentPage trong ProductManager
            this.currentPage = page;
            
            const data = await this.api.getProducts(page, this.pageSize);
            
            // Xử lý images từ API response
            const productsWithImages = ProductUtils.processProductImages(data.items);
            
            // Hiển thị sản phẩm
            this.ui.displayProducts(productsWithImages);
            this.ui.updatePagination(data);
            this.ui.updateProductCount(data);
            
        } catch (error) {
            console.error('Error loading products:', error);
            ProductUtils.showError('Lỗi khi tải sản phẩm: ' + error.message);
        } finally {
            this.ui.hideLoading();
            this.ui.hidePaginationLoading();
            this.ui.setPaginationVisibility(true);
        }
    }

    /**
     * Tìm kiếm sản phẩm
     * @param {string} name - Tên sản phẩm
     */
    async searchProducts(name) {
        try {
            this.ui.showLoading();
            
            const products = await this.api.searchProducts(name);
            
            // Xử lý images từ API response
            const productsWithImages = ProductUtils.processProductImages(products);
            
            // Hiển thị sản phẩm
            this.ui.displayProducts(productsWithImages);
            
        } catch (error) {
            console.error('Error searching products:', error);
            ProductUtils.showError('Lỗi khi tìm kiếm sản phẩm: ' + error.message);
        } finally {
            this.ui.hideLoading();
        }
    }

    /**
     * Lấy sản phẩm theo danh mục
     * @param {string} categoryId - ID danh mục
     */
    async getProductsByCategory(categoryId) {
        try {
            this.ui.showLoading();
            
            const products = await this.api.getProductsByCategory(categoryId);
            
            // Xử lý images từ API response
            const productsWithImages = ProductUtils.processProductImages(products);
            
            // Hiển thị sản phẩm
            this.ui.displayProducts(productsWithImages);
            
        } catch (error) {
            console.error('Error fetching products by category:', error);
            ProductUtils.showError('Lỗi khi tải sản phẩm theo danh mục: ' + error.message);
        } finally {
            this.ui.hideLoading();
        }
    }

    /**
     * Thêm vào giỏ hàng
     * @param {string} productId - ID sản phẩm
     * @param {string} productName - Tên sản phẩm
     * @param {number} price - Giá sản phẩm
     */
    addToCart(productId, productName, price) {
        console.log('Add to cart called:', { productId, productName, price });
        
        // Sử dụng cart count manager nếu có
        if (window.cartCountManager) {
            console.log('Using cart count manager...');
            const success = window.cartCountManager.addToCart(productId, productName, price, 1);
            if (success) {
                console.log('Cart count manager success');
                ProductUtils.showSuccess(`Đã thêm "${productName}" vào giỏ hàng!`);
            } else {
                console.log('Cart count manager failed');
                ProductUtils.showError("Lỗi khi thêm vào giỏ hàng!");
            }
            return;
        }

        // Fallback: tự xử lý nếu không có cart count manager
        console.log('Using fallback cart handling...');
        try {
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            console.log('Current cart:', cart);
            
            // Kiểm tra sản phẩm đã có trong giỏ chưa
            const existingItem = cart.find(item => item.id === productId);
            
            if (existingItem) {
                // Nếu đã có, cộng thêm số lượng
                existingItem.quantity += 1;
                console.log('Updated existing item:', existingItem);
            } else {
                // Nếu chưa có, thêm mới
                const newItem = {
                    id: productId,
                    name: productName,
                    price: parseFloat(price),
                    quantity: 1
                };
                cart.push(newItem);
                console.log('Added new item:', newItem);
            }
            
            // Lưu vào localStorage
            localStorage.setItem('cart', JSON.stringify(cart));
            console.log('Cart saved to localStorage');
            
            // Cập nhật cart count trong header
            this.updateCartCount(cart.length);
            console.log('Cart count updated:', cart.length);
            
            // Dispatch event
            window.dispatchEvent(new CustomEvent('productAddedToCart', {
                detail: { productId, productName, price, quantity: 1 }
            }));
            console.log('ProductAddedToCart event dispatched');
            
            ProductUtils.showSuccess(`Đã thêm "${productName}" vào giỏ hàng!`);
            console.log('Success notification shown');
            
        } catch (error) {
            console.error('Error adding to cart:', error);
            ProductUtils.showError("Lỗi khi thêm vào giỏ hàng!");
        }
    }

    /**
     * Cập nhật cart count trong header
     * @param {number} count - Số lượng sản phẩm
     */
    updateCartCount(count) {
        const cartSpan = document.querySelector('.fa-shopping-cart + span');
        if (cartSpan) {
            cartSpan.textContent = count;
            cartSpan.style.display = count > 0 ? 'flex' : 'none';
            
            // Thêm animation
            cartSpan.classList.add('updated');
            setTimeout(() => {
                cartSpan.classList.remove('updated');
            }, 300);
        }
    }

    /**
     * Thêm vào wishlist
     * @param {string} productId - ID sản phẩm
     * @param {string} productName - Tên sản phẩm
     */
    addToWishlist(productId, productName) {
        // TODO: Implement wishlist functionality
        console.log('Add to wishlist:', { productId, productName });
        
        // Show success message
        ProductUtils.showSuccess(`Đã thêm "${productName}" vào danh sách yêu thích!`);
    }

    /**
     * Setup global functions để có thể gọi từ HTML
     */
    setupGlobalFunctions() {
        console.log('Setting up global functions...');
        
        // Global functions cho HTML onclick
        window.addToCart = this.addToCart.bind(this);
        window.addToWishlist = this.addToWishlist.bind(this);
        window.openImageGallery = this.gallery.openImageGallery.bind(this.gallery);
        
        // Global functions cho pagination
        window.goToPage = (page) => this.ui.goToPage(page);
        
        // Global functions cho gallery
        window.closeImageGallery = this.gallery.closeImageGallery.bind(this.gallery);
        window.previousImage = this.gallery.previousImage.bind(this.gallery);
        window.nextImage = this.gallery.nextImage.bind(this.gallery);
        window.selectImage = this.gallery.selectImage.bind(this.gallery);
        window.downloadImage = this.gallery.downloadImage.bind(this.gallery);
        
        console.log('Global functions setup complete. addToCart available:', typeof window.addToCart);
    }
}

// Export cho ES6 modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProductManager;
} else {
    window.ProductManager = ProductManager;
}

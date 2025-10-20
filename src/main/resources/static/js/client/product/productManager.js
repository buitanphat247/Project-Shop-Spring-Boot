// Product Manager Module - Main controller
class ProductManager {
    constructor() {
        this.api = new ProductApi();
        this.ui = new ProductUI();
        this.gallery = new ProductGallery();
        this.currentPage = 1;
        this.pageSize = 12;
    }

    /**
     * Khởi tạo Product Manager
     */
    init() {
        this.loadProducts(this.currentPage);
        this.ui.setupEventListeners();
        this.setupGlobalFunctions();
    }

    /**
     * Load sản phẩm từ API
     * @param {number} page - Số trang
     */
    async loadProducts(page = 1) {
        try {
            this.ui.showLoading();
            
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
        // TODO: Implement add to cart functionality
        console.log('Add to cart:', { productId, productName, price });
        
        // Show success message
        ProductUtils.showSuccess(`Đã thêm "${productName}" vào giỏ hàng!`);
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
    }
}

// Export cho ES6 modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProductManager;
} else {
    window.ProductManager = ProductManager;
}

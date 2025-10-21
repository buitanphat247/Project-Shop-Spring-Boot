/**
 * Cart & Wishlist Manager
 * Quản lý tổng hợp giỏ hàng và wishlist
 */

class CartWishlistManager {
    constructor() {
        this.cartCountManager = null;
        this.wishlistCountManager = null;
        this.init();
    }

    /**
     * Khởi tạo manager
     */
    init() {
        // Đợi các manager khác được khởi tạo
        setTimeout(() => {
            this.cartCountManager = window.cartCountManager;
            this.wishlistCountManager = window.wishlistCountManager;
            this.setupGlobalEvents();
        }, 100);
    }

    /**
     * Setup global events
     */
    setupGlobalEvents() {
        // Lắng nghe sự kiện từ các trang khác
        window.addEventListener('storage', (event) => {
            if (event.key === 'cart') {
                this.refreshCartCount();
            } else if (event.key === 'wishlist') {
                this.refreshWishlistCount();
            }
        });

        // Lắng nghe sự kiện từ các component khác
        document.addEventListener('cartCountUpdated', () => {
            console.log('Global cart count updated');
        });

        document.addEventListener('wishlistCountUpdated', () => {
            console.log('Global wishlist count updated');
        });
    }

    /**
     * Refresh cart count
     */
    refreshCartCount() {
        if (this.cartCountManager) {
            this.cartCountManager.refreshCartCount();
        }
    }

    /**
     * Refresh wishlist count
     */
    refreshWishlistCount() {
        if (this.wishlistCountManager) {
            this.wishlistCountManager.loadWishlistCount();
        }
    }

    /**
     * Thêm sản phẩm vào giỏ hàng
     * @param {string} productId - ID sản phẩm
     * @param {string} productName - Tên sản phẩm
     * @param {number} productPrice - Giá sản phẩm
     * @param {number} quantity - Số lượng
     */
    addToCart(productId, productName, productPrice, quantity = 1) {
        if (this.cartCountManager) {
            return this.cartCountManager.addToCart(productId, productName, productPrice, quantity);
        }
        return false;
    }

    /**
     * Xóa sản phẩm khỏi giỏ hàng
     * @param {string} productId - ID sản phẩm
     */
    removeFromCart(productId) {
        if (this.cartCountManager) {
            return this.cartCountManager.removeFromCart(productId);
        }
        return false;
    }

    /**
     * Thêm sản phẩm vào wishlist
     * @param {string} productId - ID sản phẩm
     * @param {string} productName - Tên sản phẩm
     * @param {number} productPrice - Giá sản phẩm
     */
    addToWishlist(productId, productName, productPrice) {
        if (this.wishlistCountManager) {
            return this.wishlistCountManager.addToWishlist(productId, productName, productPrice);
        }
        return false;
    }

    /**
     * Xóa sản phẩm khỏi wishlist
     * @param {string} productId - ID sản phẩm
     */
    removeFromWishlist(productId) {
        if (this.wishlistCountManager) {
            return this.wishlistCountManager.removeFromWishlist(productId);
        }
        return false;
    }

    /**
     * Lấy thông tin giỏ hàng
     */
    getCartInfo() {
        try {
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            const totalItems = cart.reduce((total, item) => total + (item.quantity || 0), 0);
            const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
            
            return {
                items: cart,
                uniqueItems: cart.length,
                totalItems: totalItems,
                totalPrice: totalPrice
            };
        } catch (error) {
            console.error('Error getting cart info:', error);
            return {
                items: [],
                uniqueItems: 0,
                totalItems: 0,
                totalPrice: 0
            };
        }
    }

    /**
     * Lấy thông tin wishlist
     */
    getWishlistInfo() {
        try {
            const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
            return {
                items: wishlist,
                totalItems: wishlist.length
            };
        } catch (error) {
            console.error('Error getting wishlist info:', error);
            return {
                items: [],
                totalItems: 0
            };
        }
    }

    /**
     * Kiểm tra sản phẩm có trong wishlist không
     * @param {string} productId - ID sản phẩm
     */
    isInWishlist(productId) {
        if (this.wishlistCountManager) {
            return this.wishlistCountManager.isInWishlist(productId);
        }
        return false;
    }

    /**
     * Toggle wishlist (thêm/xóa)
     * @param {string} productId - ID sản phẩm
     * @param {string} productName - Tên sản phẩm
     * @param {number} productPrice - Giá sản phẩm
     */
    toggleWishlist(productId, productName, productPrice) {
        if (this.isInWishlist(productId)) {
            return this.removeFromWishlist(productId);
        } else {
            return this.addToWishlist(productId, productName, productPrice);
        }
    }
}

// Khởi tạo CartWishlistManager khi DOM ready
document.addEventListener('DOMContentLoaded', function() {
    window.cartWishlistManager = new CartWishlistManager();
    console.log('Cart & Wishlist Manager initialized');
});

// Export cho việc sử dụng global
window.CartWishlistManager = CartWishlistManager;

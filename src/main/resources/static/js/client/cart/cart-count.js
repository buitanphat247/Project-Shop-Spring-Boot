/**
 * Cart Count Management
 * Quản lý việc đếm và cập nhật số lượng giỏ hàng trong header
 */

class CartCountManager {
    constructor() {
        this.cartCountSelectors = [
            '.fa-shopping-cart + span', // Selector cho cart icon
            '.fa-heart + span' // Selector cho wishlist icon
        ];
        this.init();
    }

    /**
     * Khởi tạo cart count manager
     */
    init() {
        this.loadCartCount();
        this.setupEventListeners();
        this.setupStorageListener();
    }

    /**
     * Load số lượng giỏ hàng từ API
     */
    async loadCartCount() {
        try {
            // Sử dụng CartAPI nếu có
            if (window.CartAPI) {
                const cartAPI = new window.CartAPI();
                const cartCount = await cartAPI.getCartCount();
                this.updateCartCount(cartCount);
                console.log(`Cart count loaded from API: ${cartCount}`);
            } else {
                // Fallback về localStorage
                const cart = JSON.parse(localStorage.getItem('cart')) || [];
                const cartCount = cart.length;
                this.updateCartCount(cartCount);
                console.log(`Cart count loaded from localStorage: ${cartCount}`);
            }
            
            // Wishlist vẫn dùng localStorage
            const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
            const wishlistCount = wishlist.length;
            this.updateWishlistCount(wishlistCount);
            
        } catch (error) {
            console.error('Error loading cart count:', error);
            this.updateCartCount(0);
            this.updateWishlistCount(0);
        }
    }

    /**
     * Cập nhật số lượng giỏ hàng trong UI
     * @param {number} count - Số lượng sản phẩm trong giỏ hàng
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
        
        // Dispatch custom event để các component khác có thể lắng nghe
        window.dispatchEvent(new CustomEvent('cartCountUpdated', { 
            detail: { count } 
        }));
    }

    /**
     * Cập nhật số lượng wishlist trong UI
     * @param {number} count - Số lượng sản phẩm trong wishlist
     */
    updateWishlistCount(count) {
        const wishlistSpan = document.querySelector('.fa-heart + span');
        if (wishlistSpan) {
            wishlistSpan.textContent = count;
            wishlistSpan.style.display = count > 0 ? 'flex' : 'none';
        }
    }

    /**
     * Lấy số lượng hiện tại trong giỏ hàng
     * @returns {number} Số lượng sản phẩm trong giỏ hàng
     */
    getCurrentCartCount() {
        try {
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            return cart.length;
        } catch (error) {
            console.error('Error getting cart count:', error);
            return 0;
        }
    }

    /**
     * Lấy tổng số lượng sản phẩm (tính cả quantity)
     * @returns {number} Tổng số lượng sản phẩm
     */
    getTotalCartQuantity() {
        try {
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            return cart.reduce((total, item) => total + (item.quantity || 0), 0);
        } catch (error) {
            console.error('Error getting total cart quantity:', error);
            return 0;
        }
    }

    /**
     * Cập nhật giỏ hàng khi có thay đổi
     */
    refreshCartCount() {
        this.loadCartCount();
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Lắng nghe sự kiện thêm vào giỏ hàng
        document.addEventListener('productAddedToCart', (event) => {
            console.log('Product added to cart event received');
            this.refreshCartCount();
        });

        // Lắng nghe sự kiện xóa khỏi giỏ hàng
        document.addEventListener('productRemovedFromCart', (event) => {
            console.log('Product removed from cart event received');
            this.refreshCartCount();
        });

        // Lắng nghe sự kiện cập nhật giỏ hàng
        document.addEventListener('cartUpdated', (event) => {
            console.log('Cart updated event received');
            this.refreshCartCount();
        });

        // Lắng nghe sự kiện thêm vào wishlist
        document.addEventListener('productAddedToWishlist', (event) => {
            console.log('Product added to wishlist event received');
            this.refreshCartCount();
        });

        // Lắng nghe sự kiện xóa khỏi wishlist
        document.addEventListener('productRemovedFromWishlist', (event) => {
            console.log('Product removed from wishlist event received');
            this.refreshCartCount();
        });
    }

    /**
     * Setup storage listener để theo dõi thay đổi localStorage
     */
    setupStorageListener() {
        // Lắng nghe thay đổi localStorage từ các tab khác
        window.addEventListener('storage', (event) => {
            if (event.key === 'cart' || event.key === 'wishlist') {
                console.log('Storage changed, refreshing cart count');
                this.refreshCartCount();
            }
        });

        // Polling để kiểm tra thay đổi localStorage (fallback)
        setInterval(() => {
            const currentCartCount = this.getCurrentCartCount();
            const displayedCount = parseInt(document.querySelector('.fa-shopping-cart + span')?.textContent || '0');
            
            if (currentCartCount !== displayedCount) {
                console.log('Cart count mismatch detected, refreshing...');
                this.refreshCartCount();
            }
        }, 1000); // Kiểm tra mỗi giây
    }

    /**
     * Thêm sản phẩm vào giỏ hàng
     * @param {string} productId - ID sản phẩm
     * @param {string} productName - Tên sản phẩm
     * @param {number} productPrice - Giá sản phẩm
     * @param {number} quantity - Số lượng
     */
    async addToCart(productId, productName, productPrice, quantity = 1) {
        try {
            // Sử dụng CartAPI nếu có
            if (window.CartAPI) {
                const cartAPI = new window.CartAPI();
                const result = await cartAPI.addToCart(productId, productName, productPrice, quantity);
                
                if (result.success) {
                    // Cập nhật UI
                    this.updateCartCount(result.data.items.length);
                    
                    // Dispatch event
                    window.dispatchEvent(new CustomEvent('productAddedToCart', {
                        detail: { productId, productName, productPrice, quantity }
                    }));
                    
                    return true;
                } else {
                    console.error('API Error:', result.message);
                    return false;
                }
            } else {
                // Fallback về localStorage
                let cart = JSON.parse(localStorage.getItem('cart')) || [];
                
                // Kiểm tra sản phẩm đã có trong giỏ chưa
                const existingItem = cart.find(item => item.id === productId);
                
                if (existingItem) {
                    // Nếu đã có, cộng thêm số lượng
                    existingItem.quantity += quantity;
                } else {
                    // Nếu chưa có, thêm mới
                    cart.push({
                        id: productId,
                        name: productName,
                        price: parseFloat(productPrice),
                        quantity: quantity
                    });
                }
                
                // Lưu vào localStorage
                localStorage.setItem('cart', JSON.stringify(cart));
                
                // Cập nhật UI
                this.updateCartCount(cart.length);
                
                // Dispatch event
                window.dispatchEvent(new CustomEvent('productAddedToCart', {
                    detail: { productId, productName, productPrice, quantity }
                }));
                
                return true;
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            return false;
        }
    }

    /**
     * Xóa sản phẩm khỏi giỏ hàng
     * @param {string} productId - ID sản phẩm
     */
    removeFromCart(productId) {
        try {
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            cart = cart.filter(item => item.id !== productId);
            
            localStorage.setItem('cart', JSON.stringify(cart));
            this.updateCartCount(cart.length);
            
            window.dispatchEvent(new CustomEvent('productRemovedFromCart', {
                detail: { productId }
            }));
            
            return true;
        } catch (error) {
            console.error('Error removing from cart:', error);
            return false;
        }
    }

    /**
     * Làm trống giỏ hàng
     */
    clearCart() {
        try {
            localStorage.removeItem('cart');
            this.updateCartCount(0);
            
            window.dispatchEvent(new CustomEvent('cartCleared'));
            
            return true;
        } catch (error) {
            console.error('Error clearing cart:', error);
            return false;
        }
    }
}

// Khởi tạo CartCountManager khi DOM ready
document.addEventListener('DOMContentLoaded', function() {
    window.cartCountManager = new CartCountManager();
    console.log('Cart Count Manager initialized');
});

// Export cho việc sử dụng global
window.CartCountManager = CartCountManager;

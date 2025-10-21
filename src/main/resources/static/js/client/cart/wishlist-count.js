/**
 * Wishlist Count Management
 * Quản lý việc đếm và cập nhật số lượng wishlist trong header
 */

class WishlistCountManager {
    constructor() {
        this.init();
    }

    /**
     * Khởi tạo wishlist count manager
     */
    init() {
        this.loadWishlistCount();
        this.setupEventListeners();
    }

    /**
     * Load số lượng wishlist từ localStorage
     */
    loadWishlistCount() {
        try {
            const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
            this.updateWishlistCount(wishlist.length);
            console.log(`Wishlist count loaded: ${wishlist.length}`);
        } catch (error) {
            console.error('Error loading wishlist count:', error);
            this.updateWishlistCount(0);
        }
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
            
            // Thêm animation
            wishlistSpan.classList.add('updated');
            setTimeout(() => {
                wishlistSpan.classList.remove('updated');
            }, 300);
        }
        
        // Dispatch custom event
        window.dispatchEvent(new CustomEvent('wishlistCountUpdated', { 
            detail: { count } 
        }));
    }

    /**
     * Lấy số lượng hiện tại trong wishlist
     * @returns {number} Số lượng sản phẩm trong wishlist
     */
    getCurrentWishlistCount() {
        try {
            const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
            return wishlist.length;
        } catch (error) {
            console.error('Error getting wishlist count:', error);
            return 0;
        }
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Lắng nghe sự kiện thêm vào wishlist
        document.addEventListener('productAddedToWishlist', (event) => {
            console.log('Product added to wishlist event received');
            this.loadWishlistCount();
        });

        // Lắng nghe sự kiện xóa khỏi wishlist
        document.addEventListener('productRemovedFromWishlist', (event) => {
            console.log('Product removed from wishlist event received');
            this.loadWishlistCount();
        });

        // Lắng nghe sự kiện cập nhật wishlist
        document.addEventListener('wishlistUpdated', (event) => {
            console.log('Wishlist updated event received');
            this.loadWishlistCount();
        });
    }

    /**
     * Thêm sản phẩm vào wishlist
     * @param {string} productId - ID sản phẩm
     * @param {string} productName - Tên sản phẩm
     * @param {number} productPrice - Giá sản phẩm
     */
    addToWishlist(productId, productName, productPrice) {
        try {
            let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
            
            // Kiểm tra sản phẩm đã có trong wishlist chưa
            const existingItem = wishlist.find(item => item.id === productId);
            
            if (!existingItem) {
                wishlist.push({
                    id: productId,
                    name: productName,
                    price: parseFloat(productPrice)
                });
                
                localStorage.setItem('wishlist', JSON.stringify(wishlist));
                this.updateWishlistCount(wishlist.length);
                
                window.dispatchEvent(new CustomEvent('productAddedToWishlist', {
                    detail: { productId, productName, productPrice }
                }));
                
                return true;
            }
            
            return false; // Sản phẩm đã có trong wishlist
        } catch (error) {
            console.error('Error adding to wishlist:', error);
            return false;
        }
    }

    /**
     * Xóa sản phẩm khỏi wishlist
     * @param {string} productId - ID sản phẩm
     */
    removeFromWishlist(productId) {
        try {
            let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
            wishlist = wishlist.filter(item => item.id !== productId);
            
            localStorage.setItem('wishlist', JSON.stringify(wishlist));
            this.updateWishlistCount(wishlist.length);
            
            window.dispatchEvent(new CustomEvent('productRemovedFromWishlist', {
                detail: { productId }
            }));
            
            return true;
        } catch (error) {
            console.error('Error removing from wishlist:', error);
            return false;
        }
    }

    /**
     * Kiểm tra sản phẩm có trong wishlist không
     * @param {string} productId - ID sản phẩm
     * @returns {boolean}
     */
    isInWishlist(productId) {
        try {
            const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
            return wishlist.some(item => item.id === productId);
        } catch (error) {
            console.error('Error checking wishlist:', error);
            return false;
        }
    }
}

// Khởi tạo WishlistCountManager khi DOM ready
document.addEventListener('DOMContentLoaded', function() {
    window.wishlistCountManager = new WishlistCountManager();
    console.log('Wishlist Count Manager initialized');
});

// Export cho việc sử dụng global
window.WishlistCountManager = WishlistCountManager;

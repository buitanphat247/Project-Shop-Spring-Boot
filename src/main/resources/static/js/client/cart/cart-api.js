/**
 * Cart API Client
 * Giao tiếp với backend API cho chức năng giỏ hàng
 */

class CartAPI {
    constructor() {
        this.baseUrl = '/api/cart';
        this.sessionId = this.getOrCreateSessionId();
    }

    /**
     * Lấy hoặc tạo session ID
     */
    getOrCreateSessionId() {
        let sessionId = localStorage.getItem('sessionId');
        if (!sessionId) {
            sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('sessionId', sessionId);
        }
        return sessionId;
    }

    /**
     * Lấy giỏ hàng
     */
    async getCart() {
        try {
            const response = await fetch(`${this.baseUrl}/${this.sessionId}`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error getting cart:', error);
            throw error;
        }
    }

    /**
     * Thêm sản phẩm vào giỏ hàng
     */
    async addToCart(productId, productName, price, quantity = 1) {
        try {
            const response = await fetch(`${this.baseUrl}/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    userIdOrSessionId: this.sessionId,
                    productId: productId,
                    quantity: quantity
                })
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error adding to cart:', error);
            throw error;
        }
    }

    /**
     * Cập nhật số lượng sản phẩm trong giỏ hàng
     */
    async updateCartItemQuantity(productId, quantity) {
        try {
            const response = await fetch(`${this.baseUrl}/update`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    userIdOrSessionId: this.sessionId,
                    productId: productId,
                    quantity: quantity
                })
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error updating cart item:', error);
            throw error;
        }
    }

    /**
     * Xóa sản phẩm khỏi giỏ hàng
     */
    async removeFromCart(productId) {
        try {
            const response = await fetch(`${this.baseUrl}/remove`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    userIdOrSessionId: this.sessionId,
                    productId: productId
                })
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error removing from cart:', error);
            throw error;
        }
    }

    /**
     * Làm trống giỏ hàng
     */
    async clearCart() {
        try {
            const response = await fetch(`${this.baseUrl}/clear`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    userIdOrSessionId: this.sessionId
                })
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error clearing cart:', error);
            throw error;
        }
    }

    /**
     * Lấy số lượng sản phẩm trong giỏ hàng
     */
    async getCartCount() {
        try {
            const cartData = await this.getCart();
            if (cartData.success && cartData.data) {
                return cartData.data.items ? cartData.data.items.length : 0;
            }
            return 0;
        } catch (error) {
            console.error('Error getting cart count:', error);
            return 0;
        }
    }

    /**
     * Lấy tổng số lượng sản phẩm
     */
    async getTotalQuantity() {
        try {
            const cartData = await this.getCart();
            if (cartData.success && cartData.data) {
                return cartData.data.items ? 
                    cartData.data.items.reduce((total, item) => total + item.quantity, 0) : 0;
            }
            return 0;
        } catch (error) {
            console.error('Error getting total quantity:', error);
            return 0;
        }
    }

    /**
     * Lấy tổng tiền
     */
    async getTotalAmount() {
        try {
            const cartData = await this.getCart();
            if (cartData.success && cartData.data) {
                return cartData.data.totalAmount || 0;
            }
            return 0;
        } catch (error) {
            console.error('Error getting total amount:', error);
            return 0;
        }
    }
}

// Export cho sử dụng global
window.CartAPI = CartAPI;

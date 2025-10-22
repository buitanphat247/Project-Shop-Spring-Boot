/**
 * Order API Client
 * Giao tiếp với backend API cho chức năng đơn hàng
 */

class OrderAPI {
    constructor() {
        this.baseUrl = '/api/orders';
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
     * Tạo đơn hàng từ giỏ hàng
     */
    async createOrder(username, phone, address, notes = '') {
        try {
            const response = await fetch(`${this.baseUrl}/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    userIdOrSessionId: this.sessionId,
                    username: username,
                    phone: phone,
                    address: address,
                    notes: notes
                })
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error creating order:', error);
            throw error;
        }
    }

    /**
     * Lấy đơn hàng theo ID
     */
    async getOrderById(orderId) {
        try {
            const response = await fetch(`${this.baseUrl}/${orderId}`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error getting order:', error);
            throw error;
        }
    }

    /**
     * Lấy đơn hàng theo order number
     */
    async getOrderByOrderNumber(orderNumber) {
        try {
            const response = await fetch(`${this.baseUrl}/number/${orderNumber}`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error getting order by number:', error);
            throw error;
        }
    }

    /**
     * Lấy đơn hàng theo user ID
     */
    async getOrdersByUserId(userId, page = 0, size = 10) {
        try {
            const response = await fetch(`${this.baseUrl}/user/${userId}?page=${page}&size=${size}`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error getting orders by user:', error);
            throw error;
        }
    }

    /**
     * Lấy đơn hàng theo status
     */
    async getOrdersByStatus(status, page = 0, size = 10) {
        try {
            const response = await fetch(`${this.baseUrl}/status/${status}?page=${page}&size=${size}`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error getting orders by status:', error);
            throw error;
        }
    }

    /**
     * Lấy đơn hàng theo payment status
     */
    async getOrdersByPaymentStatus(paymentStatus, page = 0, size = 10) {
        try {
            const response = await fetch(`${this.baseUrl}/payment-status/${paymentStatus}?page=${page}&size=${size}`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error getting orders by payment status:', error);
            throw error;
        }
    }

    /**
     * Cập nhật thông tin thanh toán
     */
    async updatePaymentInfo(orderId, paymentMethod, transactionId) {
        try {
            const response = await fetch(`${this.baseUrl}/${orderId}/payment`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    paymentMethod: paymentMethod,
                    transactionId: transactionId
                })
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error updating payment info:', error);
            throw error;
        }
    }

    /**
     * Cập nhật trạng thái đơn hàng
     */
    async updateOrderStatus(orderId, status) {
        try {
            const response = await fetch(`${this.baseUrl}/${orderId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    status: status
                })
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error updating order status:', error);
            throw error;
        }
    }
}

// Export cho sử dụng global
window.OrderAPI = OrderAPI;

/**
 * Cart Demo Functions
 * Các hàm demo để test chức năng đếm giỏ hàng
 */

// Demo functions để test cart count
window.cartDemo = {
    /**
     * Thêm sản phẩm demo vào giỏ hàng
     */
    addDemoProduct() {
        const productId = 'demo-' + Date.now();
        const productName = 'Sản phẩm demo ' + Math.floor(Math.random() * 100);
        const productPrice = Math.floor(Math.random() * 1000000) + 100000;
        const quantity = Math.floor(Math.random() * 3) + 1;
        
        if (window.cartWishlistManager) {
            const success = window.cartWishlistManager.addToCart(productId, productName, productPrice, quantity);
            if (success) {
                console.log(`Đã thêm ${quantity} "${productName}" vào giỏ hàng`);
                this.showNotification('Đã thêm sản phẩm demo vào giỏ hàng!', 'success');
            }
        }
    },

    /**
     * Thêm sản phẩm demo vào wishlist
     */
    addDemoWishlist() {
        const productId = 'wishlist-demo-' + Date.now();
        const productName = 'Sản phẩm yêu thích ' + Math.floor(Math.random() * 100);
        const productPrice = Math.floor(Math.random() * 1000000) + 100000;
        
        if (window.cartWishlistManager) {
            const success = window.cartWishlistManager.addToWishlist(productId, productName, productPrice);
            if (success) {
                console.log(`Đã thêm "${productName}" vào wishlist`);
                this.showNotification('Đã thêm sản phẩm demo vào wishlist!', 'success');
            } else {
                this.showNotification('Sản phẩm đã có trong wishlist!', 'warning');
            }
        }
    },

    /**
     * Xóa tất cả sản phẩm khỏi giỏ hàng
     */
    clearCart() {
        if (window.cartCountManager) {
            const success = window.cartCountManager.clearCart();
            if (success) {
                console.log('Đã xóa tất cả sản phẩm khỏi giỏ hàng');
                this.showNotification('Đã xóa tất cả sản phẩm khỏi giỏ hàng!', 'info');
            }
        }
    },

    /**
     * Hiển thị thông tin giỏ hàng
     */
    showCartInfo() {
        if (window.cartWishlistManager) {
            const cartInfo = window.cartWishlistManager.getCartInfo();
            const wishlistInfo = window.cartWishlistManager.getWishlistInfo();
            
            console.log('=== THÔNG TIN GIỎ HÀNG ===');
            console.log('Số loại sản phẩm:', cartInfo.uniqueItems);
            console.log('Tổng số lượng:', cartInfo.totalItems);
            console.log('Tổng giá trị:', cartInfo.totalPrice.toLocaleString('vi-VN') + '₫');
            console.log('Sản phẩm trong giỏ:', cartInfo.items);
            
            console.log('=== THÔNG TIN WISHLIST ===');
            console.log('Số sản phẩm yêu thích:', wishlistInfo.totalItems);
            console.log('Sản phẩm yêu thích:', wishlistInfo.items);
            
            this.showNotification(`Giỏ hàng: ${cartInfo.uniqueItems} loại, ${cartInfo.totalItems} sản phẩm | Wishlist: ${wishlistInfo.totalItems} sản phẩm`, 'info');
        }
    },

    /**
     * Hiển thị thông báo
     */
    showNotification(message, type = 'info') {
        const bgColor = {
            'success': 'bg-green-500',
            'error': 'bg-red-500',
            'warning': 'bg-yellow-500',
            'info': 'bg-blue-500'
        }[type] || 'bg-blue-500';
        
        const icon = {
            'success': 'fa-check-circle',
            'error': 'fa-exclamation-circle',
            'warning': 'fa-exclamation-triangle',
            'info': 'fa-info-circle'
        }[type] || 'fa-info-circle';
        
        const toast = document.createElement('div');
        toast.className = `fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300`;
        toast.innerHTML = `<i class="fas ${icon} mr-2"></i>${message}`;
        
        document.body.appendChild(toast);
        
        // Hiển thị animation
        setTimeout(() => {
            toast.classList.remove('translate-x-full');
        }, 100);
        
        // Tự động ẩn sau 3 giây
        setTimeout(() => {
            toast.classList.add('translate-x-full');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3000);
    },

    /**
     * Test tất cả chức năng
     */
    runAllTests() {
        console.log('=== BẮT ĐẦU TEST CART COUNT ===');
        
        // Test thêm sản phẩm
        setTimeout(() => this.addDemoProduct(), 500);
        setTimeout(() => this.addDemoProduct(), 1000);
        setTimeout(() => this.addDemoProduct(), 1500);
        
        // Test thêm wishlist
        setTimeout(() => this.addDemoWishlist(), 2000);
        setTimeout(() => this.addDemoWishlist(), 2500);
        
        // Hiển thị thông tin
        setTimeout(() => this.showCartInfo(), 3000);
        
        console.log('=== HOÀN THÀNH TEST CART COUNT ===');
    }
};

// Thêm các nút demo vào console (chỉ trong development)
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log('=== CART DEMO FUNCTIONS ===');
    console.log('cartDemo.addDemoProduct() - Thêm sản phẩm demo vào giỏ hàng');
    console.log('cartDemo.addDemoWishlist() - Thêm sản phẩm demo vào wishlist');
    console.log('cartDemo.clearCart() - Xóa tất cả sản phẩm khỏi giỏ hàng');
    console.log('cartDemo.showCartInfo() - Hiển thị thông tin giỏ hàng');
    console.log('cartDemo.runAllTests() - Chạy tất cả test');
}

// Product Utilities Module
class ProductUtils {
    /**
     * Xử lý images từ API response
     * @param {Array} products - Danh sách sản phẩm
     * @returns {Array} - Danh sách sản phẩm đã xử lý images
     */
    static processProductImages(products) {
        return products.map(product => {
            // Xử lý images từ API response
            if (product.images && product.images.length > 0) {
                // Lấy ảnh đầu tiên làm ảnh đại diện
                product.primaryImage = product.images[0].imageUrl;
                product.allImages = product.images.map(img => ({
                    id: img.id,
                    imageUrl: img.imageUrl,
                    isPrimary: img.isPrimary
                }));
            } else {
                // Fallback image nếu không có ảnh
                product.primaryImage = this.getFallbackImage(product);
                product.allImages = [];
            }
            return product;
        });
    }

    /**
     * Lấy hình ảnh sản phẩm
     * @param {Object} product - Sản phẩm
     * @returns {string} - URL hình ảnh
     */
    static getProductImage(product) {
        // Ưu tiên sử dụng ảnh từ API
        if (product.primaryImage) {
            return product.primaryImage;
        }

        // Fallback images dựa trên tên sản phẩm
        return this.getFallbackImage(product);
    }

    /**
     * Lấy fallback image dựa trên tên sản phẩm
     * @param {Object} product - Sản phẩm
     * @returns {string} - URL fallback image
     */
    static getFallbackImage(product) {
        const productName = product.name.toLowerCase();

        if (productName.includes('áo') || productName.includes('shirt')) {
            return 'https://pos.nvncdn.com/86c7ad-50310/art/artCT/20210130_JvKCF5QqHMGWML6GkL6lKNSN.jpg';
        } else if (productName.includes('quần') || productName.includes('pants')) {
            return 'https://blog.dktcdn.net/files/chup-anh-quan-ao-3.jpg';
        } else if (productName.includes('hoodie') || productName.includes('sweater')) {
            return 'https://blog.dktcdn.net/files/cach-chup-san-pham-quan-ao-ban-hang-4.jpg';
        }

        // Default image
        return 'https://spencil.vn/wp-content/uploads/2024/11/chup-anh-san-pham-SPencil-Agency-1.jpg';
    }

    /**
     * Format giá tiền
     * @param {number} price - Giá tiền
     * @returns {string} - Giá tiền đã format
     */
    static formatPrice(price) {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    }

    /**
     * Tạo sao đánh giá
     * @param {number} rating - Điểm đánh giá
     * @returns {string} - HTML sao đánh giá
     */
    static generateStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        let stars = '';

        for (let i = 0; i < fullStars; i++) {
            stars += '<i class="fas fa-star"></i>';
        }

        if (hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        }

        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            stars += '<i class="far fa-star"></i>';
        }

        return stars;
    }

    /**
     * Hiển thị thông báo lỗi
     * @param {string} message - Nội dung thông báo
     */
    static showError(message) {
        const productGrid = document.getElementById('product-grid');
        if (!productGrid) return;

        productGrid.innerHTML = `
            <div class="col-span-full text-center py-12">
                <i class="fas fa-exclamation-triangle text-6xl text-red-300 mb-4"></i>
                <h3 class="text-xl font-semibold text-red-600 mb-2">Có lỗi xảy ra</h3>
                <p class="text-red-500">${message}</p>
                <button onclick="window.location.reload()" 
                        class="mt-4 bg-[#2f604a] text-white px-6 py-2 rounded-lg hover:bg-[#1e4a3a] transition-colors">
                    Thử lại
                </button>
            </div>
        `;
    }

    /**
     * Hiển thị thông báo thành công
     * @param {string} message - Nội dung thông báo
     */
    static showSuccess(message) {
        // Tạo toast notification
        const toast = document.createElement('div');
        toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300';
        toast.innerHTML = `
            <div class="flex items-center">
                <i class="fas fa-check-circle mr-2"></i>
                <span>${message}</span>
            </div>
        `;

        document.body.appendChild(toast);

        // Animate in
        setTimeout(() => {
            toast.classList.remove('translate-x-full');
        }, 100);

        // Auto remove
        setTimeout(() => {
            toast.classList.add('translate-x-full');
            setTimeout(() => {
                if (document.body.contains(toast)) {
                    document.body.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }
}

// Export cho ES6 modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProductUtils;
} else {
    window.ProductUtils = ProductUtils;
}

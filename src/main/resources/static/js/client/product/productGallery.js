// Product Gallery Module
class ProductGallery {
    constructor() {
        this.currentGalleryProduct = null;
        this.currentImageIndex = 0;
    }

    /**
     * Mở gallery hình ảnh
     * @param {string} productId - ID sản phẩm
     * @param {string} productName - Tên sản phẩm
     */
    openImageGallery(productId, productName) {
        // Tìm sản phẩm trong danh sách hiện tại
        const product = window.currentProducts?.find(p => p.id === productId);
        
        if (!product || !product.allImages || product.allImages.length === 0) {
            ProductUtils.showError('Không có hình ảnh nào để hiển thị');
            return;
        }

        // Tạo modal gallery
        this.createImageGalleryModal(product);
    }

    /**
     * Tạo modal gallery hình ảnh
     * @param {Object} product - Sản phẩm
     */
    createImageGalleryModal(product) {
        // Xóa modal cũ nếu có
        const existingModal = document.getElementById('imageGalleryModal');
        if (existingModal) {
            existingModal.remove();
        }
        
        const modal = document.createElement('div');
        modal.id = 'imageGalleryModal';
        modal.className = 'fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4';
        modal.innerHTML = `
            <div class="bg-white rounded-xl max-w-4xl max-h-[90vh] w-full overflow-hidden">
                <!-- Header -->
                <div class="flex items-center justify-between p-4 border-b border-gray-200">
                    <h3 class="text-lg font-semibold text-gray-900">${product.name}</h3>
                    <button onclick="window.ProductGallery.closeImageGallery()" class="text-gray-400 hover:text-gray-600 text-2xl">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <!-- Image Container -->
                <div class="relative p-4">
                    <div class="relative">
                        <img id="galleryMainImage" 
                             src="${product.allImages[0].imageUrl}" 
                             alt="${product.name}"
                             class="w-full h-96 object-contain rounded-lg">
                        
                        <!-- Navigation Buttons -->
                        ${product.allImages.length > 1 ? `
                            <button onclick="window.ProductGallery.previousImage()" 
                                    class="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-opacity-75 transition-all">
                                <i class="fas fa-chevron-left"></i>
                            </button>
                            <button onclick="window.ProductGallery.nextImage()" 
                                    class="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-opacity-75 transition-all">
                                <i class="fas fa-chevron-right"></i>
                            </button>
                        ` : ''}
                    </div>
                    
                    <!-- Thumbnail Gallery -->
                    ${product.allImages.length > 1 ? `
                        <div class="mt-4 flex gap-2 overflow-x-auto pb-2">
                            ${product.allImages.map((img, index) => `
                                <img src="${img.imageUrl}" 
                                     alt="${product.name} - ${index + 1}"
                                     class="w-16 h-16 object-cover rounded cursor-pointer border-2 border-transparent hover:border-[#2f604a] transition-all"
                                     onclick="window.ProductGallery.selectImage(${index})"
                                     id="thumb-${index}">
                            `).join('')}
                        </div>
                    ` : ''}
                </div>
                
                <!-- Footer -->
                <div class="flex items-center justify-between p-4 border-t border-gray-200">
                    <div class="text-sm text-gray-500">
                        <span id="currentImageIndex">1</span> / ${product.allImages.length}
                    </div>
                    <div class="flex gap-2">
                        <button onclick="window.ProductGallery.downloadImage()" 
                                class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                            <i class="fas fa-download mr-2"></i>
                            Tải xuống
                        </button>
                        <button onclick="this.addToCart('${product.id}', '${product.name}', ${product.price})" 
                                class="px-4 py-2 bg-[#2f604a] text-white rounded-lg hover:bg-[#1e4a3a] transition-colors">
                            <i class="fas fa-shopping-cart mr-2"></i>
                            Thêm vào giỏ
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Lưu thông tin sản phẩm vào global variable
        this.currentGalleryProduct = product;
        this.currentImageIndex = 0;
        
        // Đóng modal khi click outside
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                window.ProductGallery.closeImageGallery();
            }
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', this.handleGalleryKeydown.bind(this));
    }

    /**
     * Xử lý phím tắt trong gallery
     * @param {KeyboardEvent} e - Sự kiện phím
     */
    handleGalleryKeydown(e) {
        if (!this.currentGalleryProduct) return;
        
        switch(e.key) {
            case 'Escape':
                this.closeImageGallery();
                break;
            case 'ArrowLeft':
                this.previousImage();
                break;
            case 'ArrowRight':
                this.nextImage();
                break;
        }
    }

    /**
     * Đóng gallery
     */
    closeImageGallery() {
        const modal = document.getElementById('imageGalleryModal');
        if (modal) {
            modal.remove();
        }
        
        // Xóa event listener
        document.removeEventListener('keydown', this.handleGalleryKeydown.bind(this));
        
        // Xóa global variables
        this.currentGalleryProduct = null;
        this.currentImageIndex = 0;
    }

    /**
     * Chuyển ảnh trước
     */
    previousImage() {
        if (!this.currentGalleryProduct) return;
        
        const images = this.currentGalleryProduct.allImages;
        this.currentImageIndex = (this.currentImageIndex - 1 + images.length) % images.length;
        this.updateGalleryImage();
    }

    /**
     * Chuyển ảnh sau
     */
    nextImage() {
        if (!this.currentGalleryProduct) return;
        
        const images = this.currentGalleryProduct.allImages;
        this.currentImageIndex = (this.currentImageIndex + 1) % images.length;
        this.updateGalleryImage();
    }

    /**
     * Chọn ảnh từ thumbnail
     * @param {number} index - Chỉ số ảnh
     */
    selectImage(index) {
        if (!this.currentGalleryProduct) return;
        
        this.currentImageIndex = index;
        this.updateGalleryImage();
    }

    /**
     * Cập nhật ảnh trong gallery
     */
    updateGalleryImage() {
        if (!this.currentGalleryProduct) return;
        
        const images = this.currentGalleryProduct.allImages;
        const currentImage = images[this.currentImageIndex];
        
        // Cập nhật ảnh chính
        const mainImage = document.getElementById('galleryMainImage');
        if (mainImage) {
            mainImage.src = currentImage.imageUrl;
        }
        
        // Cập nhật số thứ tự
        const indexDisplay = document.getElementById('currentImageIndex');
        if (indexDisplay) {
            indexDisplay.textContent = this.currentImageIndex + 1;
        }
        
        // Cập nhật thumbnail active
        document.querySelectorAll('[id^="thumb-"]').forEach((thumb, index) => {
            if (index === this.currentImageIndex) {
                thumb.classList.add('border-[#2f604a]');
                thumb.classList.remove('border-transparent');
            } else {
                thumb.classList.remove('border-[#2f604a]');
                thumb.classList.add('border-transparent');
            }
        });
    }

    /**
     * Tải xuống ảnh
     */
    downloadImage() {
        if (!this.currentGalleryProduct) return;
        
        const images = this.currentGalleryProduct.allImages;
        const currentImage = images[this.currentImageIndex];
        
        const link = document.createElement('a');
        link.href = currentImage.imageUrl;
        link.download = `${this.currentGalleryProduct.name}_${this.currentImageIndex + 1}.jpg`;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

// Export cho ES6 modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProductGallery;
} else {
    window.ProductGallery = ProductGallery;
}

// Wishlist data
const wishlistData = [
    {
        id: 1,
        name: "Bơ hữu cơ tươi ngon",
        image: "https://cdn.tgdd.vn/2021/01/CookProduct/2-1200x676-6.jpg",
        price: 95000,
        originalPrice: 134000,
        rating: 5,
        available: 8,
        sold: 15,
        salePercent: 29,
        hasSale: true
    },
    {
        id: 2,
        name: "Rau xanh hữu cơ tươi",
        image: "https://mtcs.1cdn.vn/2023/05/30/rau-cu-qua.jpg",
        price: 45000,
        rating: 4,
        available: 12,
        sold: 8,
        hasSale: false
    },
    {
        id: 3,
        name: "Thực phẩm sạch mix",
        image: "https://media.istockphoto.com/id/1155240408/vi/anh/b%C3%A0n-ch%E1%BB%A9a-nhi%E1%BB%81u-lo%E1%BA%A1i-th%E1%BB%B1c-ph%E1%BA%A9m.jpg?s=612x612&w=0&k=20&c=IbFG8N9b41uM-RBYw8r0ASDoJX5RSWz9oDBN4m9gFcY=",
        price: 120000,
        rating: 5,
        available: 5,
        sold: 20,
        hasSale: false
    },
    {
        id: 4,
        name: "Trái cây tươi mix",
        image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500",
        price: 85000,
        rating: 4,
        available: 10,
        sold: 6,
        hasSale: false
    },
    {
        id: 5,
        name: "Hạt dinh dưỡng mix",
        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500",
        price: 65000,
        rating: 5,
        available: 15,
        sold: 10,
        hasSale: false
    }
];

// Render wishlist items
function renderWishlistItems() {
    const container = document.getElementById('wishlistItems');
    if (!container) return;
    
    container.innerHTML = '';
    
    wishlistData.forEach(item => {
        const itemElement = createWishlistItem(item);
        container.appendChild(itemElement);
    });
}

// Create wishlist item element
function createWishlistItem(item) {
    const article = document.createElement('article');
    article.className = 'wishlist-item bg-white rounded-2xl shadow border border-gray-200 overflow-hidden';
    
    // Calculate progress percentage
    const totalStock = item.available + item.sold;
    const progressPercent = (item.sold / totalStock) * 100;
    
    // Generate star rating
    const stars = generateStars(item.rating);
    
    article.innerHTML = `
        <div class="p-4">
            <div class="relative aspect-[4/3] bg-white rounded-xl overflow-hidden">
                <a href="/products/detail/${item.id}" class="block w-full h-full">
                    <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover" />
                </a>
                ${item.hasSale ? `<span class="absolute left-3 top-3 bg-[#e2553f] text-white text-xs font-semibold px-2 py-1 rounded-full">-${item.salePercent}%</span>` : ''}
                <button
                    onclick="removeFromWishlist(this)"
                    class="heart-btn absolute top-3 right-3 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center text-red-500 hover:bg-red-50"
                >
                    <i class="fas fa-heart text-xs"></i>
                </button>
            </div>
            <h4 class="mt-3 text-[15px] font-semibold text-[#1f2d3d]">
                <a href="/products/detail/${item.id}" class="hover:text-[#cb5439]">${item.name}</a>
            </h4>
            <div class="mt-2">
                ${stars}
            </div>
            <div class="mt-2 flex items-center justify-between">
                <div class="text-[#cb5439] font-extrabold text-xl">${formatPrice(item.price)}</div>
                <button onclick="addToCart(this)" class="w-10 h-10 rounded-full bg-[#2f604a] text-white grid place-items-center hover:bg-[#254d3b]">
                    <i class="fas fa-basket-shopping"></i>
                </button>
            </div>
            <div class="mt-3 flex items-center justify-between text-[13px] text-gray-600">
                <span>Có sẵn: ${item.available}</span>
                <span>Đã bán: ${item.sold}</span>
            </div>
            <div class="mt-2 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                <div class="h-full bg-[#2f604a] rounded-full" style="width: ${progressPercent}%"></div>
            </div>
        </div>
    `;
    
    return article;
}

// Generate star rating HTML
function generateStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars += '<i class="fas fa-star" style="color: #ffb400"></i>';
        } else {
            stars += '<i class="fas fa-star text-gray-300" style="color: #ffb400"></i>';
        }
    }
    return stars;
}

// Format price
function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN').format(price) + ' đ';
}

// Wishlist functionality
document.addEventListener('DOMContentLoaded', function() {
    // Render wishlist items
    renderWishlistItems();
    // Remove item from wishlist
    window.removeFromWishlist = function(button) {
        const wishlistItem = button.closest('.wishlist-item');
        const itemId = parseInt(wishlistItem.querySelector('a').href.split('/').pop());
        
        // Remove from data array
        const itemIndex = wishlistData.findIndex(item => item.id === itemId);
        if (itemIndex > -1) {
            wishlistData.splice(itemIndex, 1);
        }
        
        // Add removal animation
        wishlistItem.style.transition = 'all 0.3s ease';
        wishlistItem.style.transform = 'scale(0.95)';
        wishlistItem.style.opacity = '0.5';
        
        setTimeout(() => {
            wishlistItem.remove();
            updateWishlistCount();
            checkEmptyState();
        }, 300);
    };

    // Add to cart
    window.addToCart = function(button) {
        const wishlistItem = button.closest('.wishlist-item');
        const productName = wishlistItem.querySelector('h4 a').textContent;
        
        // Show success message
        showNotification(`${productName} đã được thêm vào giỏ hàng!`, 'success');
        
        // Optional: Remove from wishlist after adding to cart
        // removeFromWishlist(button);
    };

    // Clear all wishlist items
    window.clearAllWishlist = function() {
        if (confirm('Bạn có chắc muốn xóa tất cả sản phẩm khỏi danh sách yêu thích?')) {
            // Clear data array
            wishlistData.length = 0;
            
            // Re-render empty state
            renderWishlistItems();
            updateWishlistCount();
            checkEmptyState();
        }
    };

    // Continue shopping
    window.continueShopping = function() {
        window.location.href = '/products';
    };

    // Update wishlist count
    function updateWishlistCount() {
        const count = wishlistData.length;
        const countElement = document.getElementById('wishlistCount');
        if (countElement) {
            countElement.textContent = `${count} sản phẩm`;
        }
    }

    // Check if wishlist is empty
    function checkEmptyState() {
        const wishlistContent = document.getElementById('wishlistContent');
        const emptyWishlist = document.getElementById('emptyWishlist');
        
        if (wishlistData.length === 0) {
            if (wishlistContent) wishlistContent.classList.add('hidden');
            if (emptyWishlist) emptyWishlist.classList.remove('hidden');
        } else {
            if (wishlistContent) wishlistContent.classList.remove('hidden');
            if (emptyWishlist) emptyWishlist.classList.add('hidden');
        }
    }

    // Show notification
    function showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg text-white font-medium transition-all duration-300 transform translate-x-full`;
        
        // Set background color based on type
        if (type === 'success') {
            notification.style.backgroundColor = '#10b981';
        } else if (type === 'error') {
            notification.style.backgroundColor = '#ef4444';
        } else {
            notification.style.backgroundColor = '#3b82f6';
        }
        
        notification.innerHTML = `
            <div class="flex items-center space-x-2">
                <i class="fas fa-${type === 'success' ? 'check' : type === 'error' ? 'times' : 'info'}-circle"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(full)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // Initialize wishlist
    updateWishlistCount();
    checkEmptyState();

    // Add hover effects for product images
    const productImages = document.querySelectorAll('.product-image');
    productImages.forEach(img => {
        img.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
        });
        
        img.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });

    // Add click animation for buttons
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });
});

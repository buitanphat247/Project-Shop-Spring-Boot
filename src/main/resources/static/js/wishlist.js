// Wishlist data (Quần áo thời trang)
const wishlistData = [
    {
        id: 1,
        name: "Áo thun nam basic cotton",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5yFEEaLV5sTkXmHgAz2zbBIVfsWDRbtkW3w&s",
        price: 159000,
        originalPrice: 199000,
        rating: 5,
        available: 20,
        sold: 35,
        salePercent: 20,
        hasSale: true
    },
    {
        id: 2,
        name: "Áo sơ mi nữ công sở tay dài",
        image: "https://blog.dktcdn.net/files/chup-anh-quan-ao-3.jpg",
        price: 249000,
        rating: 4,
        available: 15,
        sold: 18,
        hasSale: false
    },
    {
        id: 3,
        name: "Quần jean nam slim-fit",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7yDva6T0UfL4OacdxCrZqErvd8FIxZNbf0A&s",
        price: 399000,
        originalPrice: 459000,
        rating: 5,
        available: 10,
        sold: 40,
        salePercent: 13,
        hasSale: true
    },
    {
        id: 4,
        name: "Váy hoa nữ dáng dài mùa hè",
        image: "https://pos.nvncdn.com/4e732c-26/art/artCT/20210510_LQurOt2vEZXrgsRaG9WqNnyQ.jpg",
        price: 289000,
        rating: 4,
        available: 12,
        sold: 22,
        hasSale: false
    },
    {
        id: 5,
        name: "Áo khoác nỉ unisex form rộng",
        image: "https://blog.dktcdn.net/files/cach-chup-san-pham-quan-ao-ban-hang-4.jpg",
        price: 329000,
        originalPrice: 399000,
        rating: 5,
        available: 8,
        sold: 28,
        salePercent: 17,
        hasSale: true
    }
];

// ===============================
// Phần dưới giữ nguyên toàn bộ logic
// ===============================

function renderWishlistItems() {
    const container = document.getElementById('wishlistItems');
    if (!container) return;

    container.innerHTML = '';

    wishlistData.forEach(item => {
        const itemElement = createWishlistItem(item);
        container.appendChild(itemElement);
    });
}

function createWishlistItem(item) {
    const article = document.createElement('article');
    article.className = 'wishlist-item bg-white rounded-2xl shadow border border-gray-200 overflow-hidden';

    const totalStock = item.available + item.sold;
    const progressPercent = (item.sold / totalStock) * 100;
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
            <div class="mt-2">${stars}</div>
            <div class="mt-2 flex items-center justify-between">
                <div class="text-[#cb5439] font-extrabold text-xl">${formatPrice(item.price)}</div>
                <button onclick="addToCart(this)" class="w-10 h-10 rounded-full bg-[#2f604a] text-white grid place-items-center hover:bg-[#254d3b]">
                    <i class="fas fa-basket-shopping"></i>
                </button>
            </div>
            <div class="mt-3 flex items-center justify-between text-[13px] text-gray-600">
                <span>Còn lại: ${item.available}</span>
                <span>Đã bán: ${item.sold}</span>
            </div>
            <div class="mt-2 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                <div class="h-full bg-[#2f604a] rounded-full" style="width: ${progressPercent}%"></div>
            </div>
        </div>
    `;

    return article;
}

function generateStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        stars += `<i class="fas fa-star" style="color: ${i <= rating ? '#ffb400' : '#ddd'}"></i>`;
    }
    return stars;
}

function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN').format(price) + ' đ';
}

document.addEventListener('DOMContentLoaded', function () {
    renderWishlistItems();

    window.removeFromWishlist = function (button) {
        const wishlistItem = button.closest('.wishlist-item');
        const itemId = parseInt(wishlistItem.querySelector('a').href.split('/').pop());
        const itemIndex = wishlistData.findIndex(item => item.id === itemId);
        if (itemIndex > -1) wishlistData.splice(itemIndex, 1);

        wishlistItem.style.transition = 'all 0.3s ease';
        wishlistItem.style.transform = 'scale(0.95)';
        wishlistItem.style.opacity = '0.5';

        setTimeout(() => {
            wishlistItem.remove();
            updateWishlistCount();
            checkEmptyState();
        }, 300);
    };

    window.addToCart = function (button) {
        const wishlistItem = button.closest('.wishlist-item');
        const productName = wishlistItem.querySelector('h4 a').textContent;
        showNotification(`${productName} đã được thêm vào giỏ hàng!`, 'success');
    };

    window.clearAllWishlist = function () {
        if (confirm('Bạn có chắc muốn xóa tất cả sản phẩm khỏi danh sách yêu thích?')) {
            wishlistData.length = 0;
            renderWishlistItems();
            updateWishlistCount();
            checkEmptyState();
        }
    };

    window.continueShopping = function () {
        window.location.href = '/products';
    };

    function updateWishlistCount() {
        const countElement = document.getElementById('wishlistCount');
        if (countElement) countElement.textContent = `${wishlistData.length} sản phẩm`;
    }

    function checkEmptyState() {
        const wishlistContent = document.getElementById('wishlistContent');
        const emptyWishlist = document.getElementById('emptyWishlist');
        if (wishlistData.length === 0) {
            wishlistContent?.classList.add('hidden');
            emptyWishlist?.classList.remove('hidden');
        } else {
            wishlistContent?.classList.remove('hidden');
            emptyWishlist?.classList.add('hidden');
        }
    }

    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg text-white font-medium transition-all duration-300 transform translate-x-full`;
        notification.style.backgroundColor = type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6';
        notification.innerHTML = `
            <div class="flex items-center space-x-2">
                <i class="fas fa-${type === 'success' ? 'check' : type === 'error' ? 'times' : 'info'}-circle"></i>
                <span>${message}</span>
            </div>`;
        document.body.appendChild(notification);
        setTimeout(() => { notification.style.transform = 'translateX(0)'; }, 100);
        setTimeout(() => {
            notification.style.transform = 'translateX(full)';
            setTimeout(() => document.body.removeChild(notification), 300);
        }, 3000);
    }

    updateWishlistCount();
    checkEmptyState();
});

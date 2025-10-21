$(document).ready(function() {
    // Lấy giá trị quantity từ input
    function getQuantity() {
        return parseInt($('#qty').val()) || 1;
    }

    // Cập nhật số lượng trong giỏ hàng
    function updateCartCount(count) {
        $('.fa-shopping-cart').next('span').text(count);
        
        // Dispatch event để cart-count.js có thể lắng nghe
        window.dispatchEvent(new CustomEvent('cartUpdated', {
            detail: { count }
        }));
    }

    // Lấy số lượng hiện tại trong giỏ hàng
    function getCurrentCartCount() {
        return parseInt($('.fa-shopping-cart').next('span').text()) || 0;
    }

    // Xử lý click nút "THÊM VÀO GIỎ HÀNG" cho tất cả buttons (Event Delegation)
    $(document).on('click', '[id^="add-to-cart-btn"]', function(e) {
        console.log('Add to cart button clicked!'); // Debug
        e.preventDefault();
        
        // Lấy thông tin sản phẩm từ data attributes
        const productId = $(this).data('product-id');
        const productName = $(this).data('product-name');
        const productPrice = $(this).data('product-price');
        
        // Lấy quantity từ input tương ứng
        const quantityInput = $(this).closest('.bg-white').find('input[id^="qty"]');
        const quantity = parseInt(quantityInput.val()) || 1;
        
        // Kiểm tra quantity hợp lệ
        if (quantity < 1) {
            showNotification('Số lượng phải lớn hơn 0!', 'error');
            return;
        }

        // Kiểm tra thông tin sản phẩm
        if (!productId || !productName || !productPrice || parseFloat(productPrice) <= 0) {
            showNotification('Thông tin sản phẩm không hợp lệ!', 'error');
            console.error('Invalid product data:', { productId, productName, productPrice });
            return;
        }

        // Thêm vào giỏ hàng
        addToCart(productId, productName, productPrice, quantity);
    });

    // Hàm thêm vào giỏ hàng
    function addToCart(productId, productName, productPrice, quantity) {
        // Lấy giỏ hàng hiện tại từ localStorage
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
        
        // Cập nhật UI với số loại sản phẩm (không trùng lặp)
        updateCartCount(cart.length);
        
        // Dispatch event để thông báo sản phẩm đã được thêm
        window.dispatchEvent(new CustomEvent('productAddedToCart', {
            detail: { productId, productName, productPrice, quantity }
        }));
        
        // Hiển thị thông báo
        showNotification('Đã thêm vào giỏ hàng!', 'success');
    }

    // Hiển thị thông báo
    function showNotification(message, type = 'success') {
        // Tạo toast notification
        const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';
        const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
        
        const toast = $(`
            <div class="fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300">
                <i class="fas ${icon} mr-2"></i>${message}
            </div>
        `);
        
        $('body').append(toast);
        
        // Hiển thị animation
        setTimeout(() => {
            toast.removeClass('translate-x-full');
        }, 100);
        
        // Tự động ẩn sau 3 giây
        setTimeout(() => {
            toast.addClass('translate-x-full');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3000);
    }

    // Khởi tạo số lượng giỏ hàng khi load trang
    function initCartCount() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const uniqueProductCount = cart.length; // Số loại sản phẩm (không trùng lặp)
        updateCartCount(uniqueProductCount);
    }

    // Gọi hàm khởi tạo
    initCartCount();

    // Function để re-initialize events (cho Thymeleaf fragments)
    window.initCartEvents = function() {
        console.log('Re-initializing cart events...');
        // Events đã được setup với event delegation nên không cần làm gì thêm
    };

    // Xử lý thay đổi quantity
    $('#qty').on('change', function() {
        const value = parseInt($(this).val());
        if (value < 1) {
            $(this).val(1);
        }
    });

    // Xử lý nút tăng/giảm quantity (Event Delegation)
    $(document).on('click', '.quantity-btn', function() {
        const action = $(this).data('action');
        const qtyInput = $(this).siblings('input[id^="qty"]');
        let currentValue = parseInt(qtyInput.val()) || 1;
        
        if (action === 'increase') {
            qtyInput.val(currentValue + 1);
        } else if (action === 'decrease' && currentValue > 1) {
            qtyInput.val(currentValue - 1);
        }
    });
});
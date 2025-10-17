// Cart functionality (Phiên bản cho cửa hàng quần áo)
document.addEventListener('DOMContentLoaded', function () {
    // Update quantity
    window.updateQuantity = function (button, change) {
        const input = button.parentElement.querySelector('input[type="number"]');
        const currentValue = parseInt(input.value);
        const newValue = Math.max(1, currentValue + change);
        input.value = newValue;

        // Update total price for this item
        updateItemTotal(button.closest('.cart-item'));
        updateCartSummary();
    };

    // Update item total
    function updateItemTotal(item) {
        const priceElement = item.querySelector('.text-lg.font-bold.text-\\[\\#cb5439\\]');
        const quantityInput = item.querySelector('input[type="number"]');
        const unitPrice = parseFloat(priceElement.textContent.replace(/[^\d]/g, ''));
        const quantity = parseInt(quantityInput.value);
        const total = unitPrice * quantity;

        const totalElement = item.querySelector('.text-lg.font-bold.text-\\[\\#2f604a\\]');
        totalElement.textContent = total.toLocaleString('vi-VN') + ' đ';

        const detailElement = item.querySelector('.text-sm.text-gray-500');
        const size = item.dataset.size || 'M';
        const color = item.dataset.color || 'Trắng';
        detailElement.textContent = `${unitPrice.toLocaleString('vi-VN')} đ × ${quantity} • Size: ${size} • Màu: ${color}`;
    }

    // Remove item
    window.removeItem = function (button) {
        if (confirm('Xóa sản phẩm này khỏi giỏ hàng?')) {
            button.closest('.cart-item').remove();
            updateCartSummary();
        }
    };

    // Update cart summary
    function updateCartSummary() {
        const items = document.querySelectorAll('.cart-item');
        let subtotal = 0;

        items.forEach(item => {
            const totalElement = item.querySelector('.text-lg.font-bold.text-\\[\\#2f604a\\]');
            const total = parseFloat(totalElement.textContent.replace(/[^\d]/g, ''));
            subtotal += total;
        });

        document.getElementById('subtotal').textContent = subtotal.toLocaleString('vi-VN') + ' đ';
        document.getElementById('total').textContent = subtotal.toLocaleString('vi-VN') + ' đ';
        document.getElementById('itemCount').textContent = items.length + ' sản phẩm';
    }

    // Apply discount code
    window.applyDiscount = function () {
        const discountInput = document.querySelector('input[placeholder="Nhập mã giảm giá"]');
        const discountCode = discountInput.value.trim().toUpperCase();

        if (discountCode === '') {
            alert('Vui lòng nhập mã giảm giá');
            return;
        }

        // Mock discount logic
        const validCodes = {
            "SALE10": 0.1,
            "FASHION15": 0.15,
            "WELCOME": 0.1
        };

        if (validCodes[discountCode]) {
            const rate = validCodes[discountCode];
            alert(`Mã ${discountCode} đã được áp dụng! Giảm ${(rate * 100).toFixed(0)}%`);

            const subtotal = parseFloat(document.getElementById('subtotal').textContent.replace(/[^\d]/g, ''));
            const discount = subtotal * rate;
            const total = subtotal - discount;

            document.getElementById('total').textContent = total.toLocaleString('vi-VN') + ' đ';
            discountInput.value = '';
            discountInput.disabled = true;
        } else {
            alert('Mã giảm giá không hợp lệ');
        }
    };

    // Continue shopping
    window.continueShopping = function () {
        window.location.href = '/products';
    };

    // Clear all items
    window.clearAllItems = function () {
        if (confirm('Bạn có chắc muốn xóa tất cả sản phẩm trong giỏ hàng?')) {
            document.getElementById('cartItems').innerHTML = `
                <div class="p-8 text-center text-gray-500">
                    <i class="fas fa-tshirt text-4xl mb-4"></i>
                    <p>Giỏ hàng trống – Hãy tiếp tục mua sắm!</p>
                </div>`;
            updateCartSummary();
        }
    };

    // Checkout
    window.checkout = function () {
        const items = document.querySelectorAll('.cart-item');
        if (items.length === 0) {
            alert('Giỏ hàng trống!');
            return;
        }

        // Mock checkout process
        alert('Đang chuyển đến trang thanh toán...');
        // window.location.href = '/checkout';
    };

    // Initialize cart
    updateCartSummary();

    // Add event listeners
    const applyBtn = document.querySelector('button[onclick="applyDiscount()"]');
    if (applyBtn) {
        applyBtn.addEventListener('click', applyDiscount);
    }

    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', checkout);
    }
});

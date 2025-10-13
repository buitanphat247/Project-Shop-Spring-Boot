// Custom JavaScript cho Spring Boot Shop

document.addEventListener('DOMContentLoaded', function() {
    console.log('Spring Boot Shop đã sẵn sàng!');
    
    // Thêm hiệu ứng cho các card
    const cards = document.querySelectorAll('.feature-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Kiểm tra health status
    checkHealthStatus();
});

// Hàm kiểm tra trạng thái health
async function checkHealthStatus() {
    try {
        const response = await fetch('/actuator/health');
        const data = await response.json();
        
        if (data.status === 'UP') {
            console.log('✅ Ứng dụng hoạt động bình thường');
        } else {
            console.warn('⚠️ Ứng dụng có vấn đề:', data);
        }
    } catch (error) {
        console.error('❌ Không thể kiểm tra health status:', error);
    }
}

// Hàm hiển thị thông báo
function showMessage(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.insertBefore(alertDiv, document.body.firstChild);
    
    // Tự động ẩn sau 5 giây
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}

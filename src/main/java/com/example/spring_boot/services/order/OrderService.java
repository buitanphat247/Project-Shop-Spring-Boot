package com.example.spring_boot.services.order;

import com.example.spring_boot.domains.cart.Cart;
import com.example.spring_boot.domains.cart.CartItem;
import com.example.spring_boot.domains.order.Order;
import com.example.spring_boot.domains.order.OrderItem;
import com.example.spring_boot.repository.order.OrderRepository;
import com.example.spring_boot.services.cart.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class OrderService {
    
    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private CartService cartService;
    
    /**
     * Tạo đơn hàng từ giỏ hàng
     */
    public Order createOrderFromCart(String userIdOrSessionId, String username, String phone, String address, String notes) {
        // Lấy giỏ hàng
        Cart cart = cartService.getCart(userIdOrSessionId).orElseThrow(() -> new RuntimeException("Giỏ hàng không tồn tại"));
        
        if (cart.isEmpty()) {
            throw new RuntimeException("Giỏ hàng trống");
        }
        
        // Tạo đơn hàng
        Order order = new Order(userIdOrSessionId, userIdOrSessionId, username, phone, address);
        order.setNotes(notes);
        
        // Chuyển items từ cart sang order
        for (CartItem cartItem : cart.getItems()) {
            OrderItem orderItem = new OrderItem(
                cartItem.getProductId(),
                cartItem.getProductName(),
                cartItem.getPrice(),
                cartItem.getQuantity()
            );
            order.addItem(orderItem);
        }
        
        // Lưu đơn hàng (chưa xóa cart)
        Order savedOrder = orderRepository.save(order);
        
        // KHÔNG xóa cart ở đây - chỉ xóa khi thanh toán thành công
        // cartService.clearCart(userIdOrSessionId);
        
        return savedOrder;
    }
    
    /**
     * Lấy đơn hàng theo ID
     */
    public Optional<Order> getOrderById(String orderId) {
        return orderRepository.findById(orderId);
    }
    
    /**
     * Lấy đơn hàng theo order number
     */
    public Optional<Order> getOrderByOrderNumber(String orderNumber) {
        return orderRepository.findByOrderNumber(orderNumber);
    }
    
    /**
     * Lấy đơn hàng theo user ID
     */
    public List<Order> getOrdersByUserId(String userId) {
        return orderRepository.findByUserId(userId);
    }
    
    /**
     * Lấy đơn hàng theo user ID với pagination
     */
    public Page<Order> getOrdersByUserId(String userId, Pageable pageable) {
        return orderRepository.findByUserId(userId, pageable);
    }
    
    /**
     * Lấy đơn hàng theo session ID
     */
    public List<Order> getOrdersBySessionId(String sessionId) {
        return orderRepository.findBySessionId(sessionId);
    }
    
    /**
     * Lấy đơn hàng theo status
     */
    public List<Order> getOrdersByStatus(String status) {
        return orderRepository.findByStatus(status);
    }
    
    /**
     * Lấy đơn hàng theo status với pagination
     */
    public Page<Order> getOrdersByStatus(String status, Pageable pageable) {
        return orderRepository.findByStatus(status, pageable);
    }
    
    /**
     * Lấy đơn hàng theo payment status
     */
    public List<Order> getOrdersByPaymentStatus(String paymentStatus) {
        return orderRepository.findByPaymentStatus(paymentStatus);
    }
    
    /**
     * Lấy đơn hàng theo payment status với pagination
     */
    public Page<Order> getOrdersByPaymentStatus(String paymentStatus, Pageable pageable) {
        return orderRepository.findByPaymentStatus(paymentStatus, pageable);
    }
    
    /**
     * Lấy đơn hàng theo user ID và status
     */
    public List<Order> getOrdersByUserIdAndStatus(String userId, String status) {
        return orderRepository.findByUserIdAndStatus(userId, status);
    }
    
    /**
     * Lấy đơn hàng theo user ID và status với pagination
     */
    public Page<Order> getOrdersByUserIdAndStatus(String userId, String status, Pageable pageable) {
        return orderRepository.findByUserIdAndStatus(userId, status, pageable);
    }
    
    /**
     * Lấy đơn hàng theo date range
     */
    public List<Order> getOrdersByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return orderRepository.findByCreatedAtBetween(startDate, endDate);
    }
    
    /**
     * Lấy đơn hàng theo date range với pagination
     */
    public Page<Order> getOrdersByDateRange(LocalDateTime startDate, LocalDateTime endDate, Pageable pageable) {
        return orderRepository.findByCreatedAtBetween(startDate, endDate, pageable);
    }
    
    /**
     * Lấy đơn hàng theo transaction ID
     */
    public Optional<Order> getOrderByTransactionId(String transactionId) {
        return orderRepository.findByTransactionId(transactionId);
    }
    
    /**
     * Lấy đơn hàng theo phone
     */
    public List<Order> getOrdersByPhone(String phone) {
        return orderRepository.findByPhone(phone);
    }
    
    /**
     * Lấy đơn hàng theo phone với pagination
     */
    public Page<Order> getOrdersByPhone(String phone, Pageable pageable) {
        return orderRepository.findByPhone(phone, pageable);
    }
    
    /**
     * Tìm kiếm đơn hàng theo username
     */
    public List<Order> searchOrdersByUsername(String username) {
        return orderRepository.findByUsernameContainingIgnoreCase(username);
    }
    
    /**
     * Tìm kiếm đơn hàng theo username với pagination
     */
    public Page<Order> searchOrdersByUsername(String username, Pageable pageable) {
        return orderRepository.findByUsernameContainingIgnoreCase(username, pageable);
    }
    
    /**
     * Cập nhật thông tin thanh toán
     */
    public Order updatePaymentInfo(String orderId, String paymentMethod, String transactionId) {
        Order order = getOrderById(orderId).orElseThrow(() -> new RuntimeException("Đơn hàng không tồn tại"));
        
        order.updatePaymentInfo(paymentMethod, transactionId);
        
        return orderRepository.save(order);
    }
    
    /**
     * Cập nhật trạng thái đơn hàng
     */
    public Order updateOrderStatus(String orderId, String status) {
        Order order = getOrderById(orderId).orElseThrow(() -> new RuntimeException("Đơn hàng không tồn tại"));
        
        order.updateStatus(status);
        
        return orderRepository.save(order);
    }
    
    /**
     * Lấy tất cả đơn hàng
     */
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }
    
    /**
     * Lấy tất cả đơn hàng với pagination
     */
    public Page<Order> getAllOrders(Pageable pageable) {
        return orderRepository.findAll(pageable);
    }
    
    /**
     * Xóa đơn hàng
     */
    public void deleteOrder(String orderId) {
        orderRepository.deleteById(orderId);
    }
    
    /**
     * Xử lý thanh toán thành công - xóa cart và cập nhật order
     * 
     * CART: ❌ XÓA HOÀN TOÀN (clearCart)
     * ORDER: ✅ Cập nhật thành PROCESSING + PAID
     */
    public Order handlePaymentSuccess(String orderId, String transactionId) {
        Order order = getOrderById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found with ID: " + orderId));
        
        System.out.println("=== THANH TOÁN THÀNH CÔNG ===");
        System.out.println("Order ID: " + orderId);
        System.out.println("Transaction ID: " + transactionId);
        
        // 1. Cập nhật trạng thái Order
        order.setStatus("PROCESSING");           // Đơn hàng đang xử lý
        order.setPaymentStatus("PAID");          // Đã thanh toán
        order.setTransactionId(transactionId);    // Mã giao dịch VNPay
        order.setPaymentTime(LocalDateTime.now()); // Thời gian thanh toán
        order.setUpdatedAt(LocalDateTime.now());
        
        // 2. XÓA CART HOÀN TOÀN (vì đã thanh toán thành công)
        String identifier = order.getUserId() != null ? order.getUserId() : order.getSessionId();
        cartService.clearCart(identifier);
        System.out.println("✅ Cart đã được xóa cho user: " + identifier);
        
        // 3. Lưu Order
        Order savedOrder = orderRepository.save(order);
        System.out.println("✅ Order đã được cập nhật: " + savedOrder.getId());
        
        return savedOrder;
    }
    
    /**
     * Xử lý thanh toán thất bại - chỉ cập nhật trạng thái
     * 
     * CART: ✅ GIỮ NGUYÊN (không xóa)
     * ORDER: ❌ Cập nhật thành CANCELLED + FAILED
     */
    public Order handlePaymentFailure(String orderId, String reason) {
        Order order = getOrderById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found with ID: " + orderId));
        
        System.out.println("=== THANH TOÁN THẤT BẠI ===");
        System.out.println("Order ID: " + orderId);
        System.out.println("Reason: " + reason);
        
        // 1. Cập nhật trạng thái Order
        order.setStatus("CANCELLED");            // Đơn hàng bị hủy
        order.setPaymentStatus("FAILED");         // Thanh toán thất bại
        order.setTransactionId(null);            // Không có mã giao dịch
        order.setPaymentTime(null);              // Không có thời gian thanh toán
        order.setUpdatedAt(LocalDateTime.now());
        
        // 2. KHÔNG XÓA CART (để user có thể thử lại)
        System.out.println("✅ Cart được giữ nguyên để user thử lại");
        
        // 3. Lưu Order
        Order savedOrder = orderRepository.save(order);
        System.out.println("❌ Order đã được hủy: " + savedOrder.getId());
        
        return savedOrder;
    }
    
    /**
     * Đếm đơn hàng theo status
     */
    public long countOrdersByStatus(String status) {
        return orderRepository.countByStatus(status);
    }
    
    /**
     * Đếm đơn hàng theo payment status
     */
    public long countOrdersByPaymentStatus(String paymentStatus) {
        return orderRepository.countByPaymentStatus(paymentStatus);
    }
    
    /**
     * Đếm đơn hàng theo user ID
     */
    public long countOrdersByUserId(String userId) {
        return orderRepository.countByUserId(userId);
    }
    
    /**
     * Đếm đơn hàng theo date range
     */
    public long countOrdersByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return orderRepository.countByCreatedAtBetween(startDate, endDate);
    }
}

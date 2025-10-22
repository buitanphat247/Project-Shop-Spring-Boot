package com.example.spring_boot.controllers.modules.order;

import com.example.spring_boot.domains.order.Order;
import com.example.spring_boot.services.order.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {
    
    @Autowired
    private OrderService orderService;
    
    /**
     * Tạo đơn hàng từ giỏ hàng
     */
    @PostMapping("/create")
    public ResponseEntity<Map<String, Object>> createOrder(
            @RequestParam String userIdOrSessionId,
            @RequestParam String username,
            @RequestParam String phone,
            @RequestParam String address,
            @RequestParam(required = false) String notes) {
        try {
            Order order = orderService.createOrderFromCart(userIdOrSessionId, username, phone, address, notes);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", order);
            response.put("message", "Tạo đơn hàng thành công");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Lỗi khi tạo đơn hàng: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    /**
     * Lấy đơn hàng theo ID
     */
    @GetMapping("/{orderId}")
    public ResponseEntity<Map<String, Object>> getOrderById(@PathVariable String orderId) {
        try {
            Optional<Order> order = orderService.getOrderById(orderId);
            
            Map<String, Object> response = new HashMap<>();
            if (order.isPresent()) {
                response.put("success", true);
                response.put("data", order.get());
                response.put("message", "Lấy đơn hàng thành công");
            } else {
                response.put("success", false);
                response.put("message", "Đơn hàng không tồn tại");
            }
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Lỗi khi lấy đơn hàng: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    /**
     * Lấy đơn hàng theo order number
     */
    @GetMapping("/number/{orderNumber}")
    public ResponseEntity<Map<String, Object>> getOrderByOrderNumber(@PathVariable String orderNumber) {
        try {
            Optional<Order> order = orderService.getOrderByOrderNumber(orderNumber);
            
            Map<String, Object> response = new HashMap<>();
            if (order.isPresent()) {
                response.put("success", true);
                response.put("data", order.get());
                response.put("message", "Lấy đơn hàng thành công");
            } else {
                response.put("success", false);
                response.put("message", "Đơn hàng không tồn tại");
            }
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Lỗi khi lấy đơn hàng: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    /**
     * Lấy đơn hàng theo user ID
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<Map<String, Object>> getOrdersByUserId(
            @PathVariable String userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        try {
            Sort sort = sortDir.equalsIgnoreCase("desc") ? 
                Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
            Pageable pageable = PageRequest.of(page, size, sort);
            
            Page<Order> orders = orderService.getOrdersByUserId(userId, pageable);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", orders.getContent());
            response.put("totalElements", orders.getTotalElements());
            response.put("totalPages", orders.getTotalPages());
            response.put("currentPage", orders.getNumber());
            response.put("message", "Lấy danh sách đơn hàng thành công");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Lỗi khi lấy danh sách đơn hàng: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    /**
     * Lấy đơn hàng theo status
     */
    @GetMapping("/status/{status}")
    public ResponseEntity<Map<String, Object>> getOrdersByStatus(
            @PathVariable String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
            Page<Order> orders = orderService.getOrdersByStatus(status, pageable);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", orders.getContent());
            response.put("totalElements", orders.getTotalElements());
            response.put("totalPages", orders.getTotalPages());
            response.put("currentPage", orders.getNumber());
            response.put("message", "Lấy danh sách đơn hàng thành công");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Lỗi khi lấy danh sách đơn hàng: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    /**
     * Lấy đơn hàng theo payment status
     */
    @GetMapping("/payment-status/{paymentStatus}")
    public ResponseEntity<Map<String, Object>> getOrdersByPaymentStatus(
            @PathVariable String paymentStatus,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
            Page<Order> orders = orderService.getOrdersByPaymentStatus(paymentStatus, pageable);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", orders.getContent());
            response.put("totalElements", orders.getTotalElements());
            response.put("totalPages", orders.getTotalPages());
            response.put("currentPage", orders.getNumber());
            response.put("message", "Lấy danh sách đơn hàng thành công");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Lỗi khi lấy danh sách đơn hàng: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    /**
     * Cập nhật thông tin thanh toán
     */
    @PutMapping("/{orderId}/payment")
    public ResponseEntity<Map<String, Object>> updatePaymentInfo(
            @PathVariable String orderId,
            @RequestParam String paymentMethod,
            @RequestParam String transactionId) {
        try {
            Order order = orderService.updatePaymentInfo(orderId, paymentMethod, transactionId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", order);
            response.put("message", "Cập nhật thông tin thanh toán thành công");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Lỗi khi cập nhật thông tin thanh toán: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    /**
     * Cập nhật trạng thái đơn hàng
     */
    @PutMapping("/{orderId}/status")
    public ResponseEntity<Map<String, Object>> updateOrderStatus(
            @PathVariable String orderId,
            @RequestParam String status) {
        try {
            Order order = orderService.updateOrderStatus(orderId, status);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", order);
            response.put("message", "Cập nhật trạng thái đơn hàng thành công");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Lỗi khi cập nhật trạng thái đơn hàng: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    /**
     * Lấy tất cả đơn hàng (Admin)
     */
    @GetMapping("/admin/all")
    public ResponseEntity<Map<String, Object>> getAllOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
            Page<Order> orders = orderService.getAllOrders(pageable);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", orders.getContent());
            response.put("totalElements", orders.getTotalElements());
            response.put("totalPages", orders.getTotalPages());
            response.put("currentPage", orders.getNumber());
            response.put("message", "Lấy danh sách đơn hàng thành công");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Lỗi khi lấy danh sách đơn hàng: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    /**
     * Xóa đơn hàng (Admin)
     */
    @DeleteMapping("/admin/{orderId}")
    public ResponseEntity<Map<String, Object>> deleteOrder(@PathVariable String orderId) {
        try {
            orderService.deleteOrder(orderId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Xóa đơn hàng thành công");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Lỗi khi xóa đơn hàng: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    /**
     * Xử lý thanh toán thành công
     */
    @PostMapping("/{orderId}/payment-success")
    public ResponseEntity<Map<String, Object>> handlePaymentSuccess(
            @PathVariable String orderId,
            @RequestParam String transactionId) {
        try {
            Order order = orderService.handlePaymentSuccess(orderId, transactionId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Thanh toán thành công");
            response.put("data", order);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Lỗi khi xử lý thanh toán thành công: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    /**
     * Xử lý thanh toán thất bại
     */
    @PostMapping("/{orderId}/payment-failure")
    public ResponseEntity<Map<String, Object>> handlePaymentFailure(
            @PathVariable String orderId,
            @RequestParam String reason) {
        try {
            Order order = orderService.handlePaymentFailure(orderId, reason);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Thanh toán thất bại đã được xử lý");
            response.put("data", order);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Lỗi khi xử lý thanh toán thất bại: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}

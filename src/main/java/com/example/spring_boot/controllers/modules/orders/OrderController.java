package com.example.spring_boot.controllers.modules.orders;

import com.example.spring_boot.domains.orders.Order;
import com.example.spring_boot.domains.orders.OrderItem;
import com.example.spring_boot.services.orders.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Order Management", description = "APIs for managing orders and order items")
public class OrderController {

    private final OrderService orderService;

    /** Tạo order mới. */
    @PostMapping
    @Operation(
        summary = "Tạo đơn hàng mới",
        description = "Tạo một đơn hàng mới với thông tin người dùng, địa chỉ, phương thức thanh toán và danh sách sản phẩm"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Tạo đơn hàng thành công"),
        @ApiResponse(responseCode = "400", description = "Dữ liệu đầu vào không hợp lệ"),
        @ApiResponse(responseCode = "500", description = "Lỗi server")
    })
    public ResponseEntity<Map<String, Object>> createOrder(@RequestBody CreateOrderRequest request) {
        try {
            log.info("Creating order for user: {}", request.getUserId());
            
            Order order = orderService.createOrder(
                request.getUserId(),
                request.getAddress(),
                request.getPaymentMethod(),
                request.getOrderItems()
            );
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Order created successfully",
                "data", order
            ));
        } catch (Exception e) {
            log.error("Error creating order", e);
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "Failed to create order: " + e.getMessage()
            ));
        }
    }

    /** Lấy order theo ID. */
    @GetMapping("/{id}")
    @Operation(
        summary = "Lấy thông tin đơn hàng",
        description = "Lấy thông tin chi tiết của một đơn hàng theo ID"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Lấy thông tin đơn hàng thành công"),
        @ApiResponse(responseCode = "404", description = "Không tìm thấy đơn hàng"),
        @ApiResponse(responseCode = "500", description = "Lỗi server")
    })
    public ResponseEntity<Map<String, Object>> getOrderById(
            @Parameter(description = "ID của đơn hàng", required = true)
            @PathVariable String id) {
        try {
            log.info("Getting order by ID: {}", id);
            
            Order order = orderService.getOrderById(id);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "data", order
            ));
        } catch (Exception e) {
            log.error("Error getting order by ID: {}", id, e);
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "Failed to get order: " + e.getMessage()
            ));
        }
    }

    /** Lấy order với items. */
    @GetMapping("/{id}/items")
    @Operation(
        summary = "Lấy đơn hàng với danh sách sản phẩm",
        description = "Lấy thông tin đơn hàng kèm theo danh sách tất cả sản phẩm trong đơn hàng"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Lấy thông tin đơn hàng và sản phẩm thành công"),
        @ApiResponse(responseCode = "404", description = "Không tìm thấy đơn hàng"),
        @ApiResponse(responseCode = "500", description = "Lỗi server")
    })
    public ResponseEntity<Map<String, Object>> getOrderWithItems(
            @Parameter(description = "ID của đơn hàng", required = true)
            @PathVariable String id) {
        try {
            log.info("Getting order with items: {}", id);
            
            Map<String, Object> orderWithItems = orderService.getOrderWithItems(id);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "data", orderWithItems
            ));
        } catch (Exception e) {
            log.error("Error getting order with items: {}", id, e);
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "Failed to get order with items: " + e.getMessage()
            ));
        }
    }

    /** Cập nhật order. */
    @PutMapping("/{id}")
    @Operation(
        summary = "Cập nhật đơn hàng",
        description = "Cập nhật thông tin đơn hàng như trạng thái, địa chỉ, phương thức thanh toán"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Cập nhật đơn hàng thành công"),
        @ApiResponse(responseCode = "404", description = "Không tìm thấy đơn hàng"),
        @ApiResponse(responseCode = "400", description = "Dữ liệu đầu vào không hợp lệ"),
        @ApiResponse(responseCode = "500", description = "Lỗi server")
    })
    public ResponseEntity<Map<String, Object>> updateOrder(
            @Parameter(description = "ID của đơn hàng", required = true)
            @PathVariable String id,
            @RequestBody UpdateOrderRequest request) {
        try {
            log.info("Updating order: {}", id);
            
            Order order = orderService.updateOrder(
                id,
                request.getStatus(),
                request.getAddress(),
                request.getPaymentMethod()
            );
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Order updated successfully",
                "data", order
            ));
        } catch (Exception e) {
            log.error("Error updating order: {}", id, e);
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "Failed to update order: " + e.getMessage()
            ));
        }
    }

    /** Xóa order. */
    @DeleteMapping("/{id}")
    @Operation(
        summary = "Xóa đơn hàng",
        description = "Xóa mềm đơn hàng (đánh dấu deletedAt thay vì xóa thật)"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Xóa đơn hàng thành công"),
        @ApiResponse(responseCode = "404", description = "Không tìm thấy đơn hàng"),
        @ApiResponse(responseCode = "500", description = "Lỗi server")
    })
    public ResponseEntity<Map<String, Object>> deleteOrder(
            @Parameter(description = "ID của đơn hàng", required = true)
            @PathVariable String id) {
        try {
            log.info("Deleting order: {}", id);
            
            orderService.deleteOrder(id);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Order deleted successfully"
            ));
        } catch (Exception e) {
            log.error("Error deleting order: {}", id, e);
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "Failed to delete order: " + e.getMessage()
            ));
        }
    }

    /** Lấy orders theo user ID. */
    @GetMapping("/user/{userId}")
    @Operation(
        summary = "Lấy đơn hàng theo người dùng",
        description = "Lấy danh sách tất cả đơn hàng của một người dùng cụ thể"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Lấy danh sách đơn hàng thành công"),
        @ApiResponse(responseCode = "500", description = "Lỗi server")
    })
    public ResponseEntity<Map<String, Object>> getOrdersByUserId(
            @Parameter(description = "ID của người dùng", required = true)
            @PathVariable String userId) {
        try {
            log.info("Getting orders for user: {}", userId);
            
            List<Order> orders = orderService.getOrdersByUserId(userId);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "data", orders
            ));
        } catch (Exception e) {
            log.error("Error getting orders for user: {}", userId, e);
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "Failed to get orders: " + e.getMessage()
            ));
        }
    }

    /** Lấy orders theo status. */
    @GetMapping("/status/{status}")
    @Operation(
        summary = "Lấy đơn hàng theo trạng thái",
        description = "Lấy danh sách đơn hàng theo trạng thái (pending, confirmed, shipped, delivered, cancelled)"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Lấy danh sách đơn hàng theo trạng thái thành công"),
        @ApiResponse(responseCode = "500", description = "Lỗi server")
    })
    public ResponseEntity<Map<String, Object>> getOrdersByStatus(
            @Parameter(description = "Trạng thái đơn hàng (pending, confirmed, shipped, delivered, cancelled)", required = true)
            @PathVariable String status) {
        try {
            log.info("Getting orders with status: {}", status);
            
            List<Order> orders = orderService.getOrdersByStatus(status);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "data", orders
            ));
        } catch (Exception e) {
            log.error("Error getting orders by status: {}", status, e);
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "Failed to get orders: " + e.getMessage()
            ));
        }
    }

    /** Lấy tất cả orders. */
    @GetMapping
    @Operation(
        summary = "Lấy tất cả đơn hàng",
        description = "Lấy danh sách tất cả đơn hàng đang hoạt động (chưa bị xóa)"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Lấy danh sách tất cả đơn hàng thành công"),
        @ApiResponse(responseCode = "500", description = "Lỗi server")
    })
    public ResponseEntity<Map<String, Object>> getAllOrders() {
        try {
            log.info("Getting all orders");
            
            List<Order> orders = orderService.getAllActiveOrders();
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "data", orders
            ));
        } catch (Exception e) {
            log.error("Error getting all orders", e);
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "Failed to get orders: " + e.getMessage()
            ));
        }
    }

    /** Phân trang orders. */
    @GetMapping("/paged")
    @Operation(
        summary = "Lấy đơn hàng có phân trang",
        description = "Lấy danh sách đơn hàng với phân trang, sắp xếp và giới hạn số lượng"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Lấy danh sách đơn hàng có phân trang thành công"),
        @ApiResponse(responseCode = "500", description = "Lỗi server")
    })
    public ResponseEntity<Map<String, Object>> getOrdersWithPagination(
            @Parameter(description = "Thông tin phân trang (page, size, sort)")
            Pageable pageable) {
        try {
            log.info("Getting orders with pagination");
            
            Page<Order> orders = orderService.getOrdersWithPagination(pageable);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "data", Map.of(
                    "items", orders.getContent(),
                    "totalElements", orders.getTotalElements(),
                    "totalPages", orders.getTotalPages(),
                    "currentPage", orders.getNumber(),
                    "size", orders.getSize()
                )
            ));
        } catch (Exception e) {
            log.error("Error getting orders with pagination", e);
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "Failed to get orders: " + e.getMessage()
            ));
        }
    }

    /** Đếm orders theo user ID. */
    @GetMapping("/user/{userId}/count")
    @Operation(
        summary = "Đếm số đơn hàng theo người dùng",
        description = "Đếm tổng số đơn hàng của một người dùng cụ thể"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Đếm số đơn hàng thành công"),
        @ApiResponse(responseCode = "500", description = "Lỗi server")
    })
    public ResponseEntity<Map<String, Object>> countOrdersByUserId(
            @Parameter(description = "ID của người dùng", required = true)
            @PathVariable String userId) {
        try {
            long count = orderService.countOrdersByUserId(userId);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "data", Map.of("count", count)
            ));
        } catch (Exception e) {
            log.error("Error counting orders for user: {}", userId, e);
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "Failed to count orders: " + e.getMessage()
            ));
        }
    }

    /** Lấy thống kê orders. */
    @GetMapping("/statistics")
    @Operation(
        summary = "Lấy thống kê đơn hàng",
        description = "Lấy thống kê tổng quan về đơn hàng theo trạng thái và tổng số lượng"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Lấy thống kê đơn hàng thành công"),
        @ApiResponse(responseCode = "500", description = "Lỗi server")
    })
    public ResponseEntity<Map<String, Object>> getOrderStatistics() {
        try {
            Map<String, Object> stats = orderService.getOrderStatistics();
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "data", stats
            ));
        } catch (Exception e) {
            log.error("Error getting order statistics", e);
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "Failed to get statistics: " + e.getMessage()
            ));
        }
    }

    // =====================================================
    // REQUEST DTOs
    // =====================================================

    public static class CreateOrderRequest {
        private String userId;
        private String address;
        private String paymentMethod;
        private List<OrderItem> orderItems;

        // Getters and Setters
        public String getUserId() { return userId; }
        public void setUserId(String userId) { this.userId = userId; }
        
        public String getAddress() { return address; }
        public void setAddress(String address) { this.address = address; }
        
        public String getPaymentMethod() { return paymentMethod; }
        public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
        
        public List<OrderItem> getOrderItems() { return orderItems; }
        public void setOrderItems(List<OrderItem> orderItems) { this.orderItems = orderItems; }
    }

    public static class UpdateOrderRequest {
        private String status;
        private String address;
        private String paymentMethod;

        // Getters and Setters
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
        
        public String getAddress() { return address; }
        public void setAddress(String address) { this.address = address; }
        
        public String getPaymentMethod() { return paymentMethod; }
        public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
    }
}

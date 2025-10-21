package com.example.spring_boot.services.orders;

import com.example.spring_boot.domains.orders.Order;
import com.example.spring_boot.domains.orders.OrderItem;
import com.example.spring_boot.repository.orders.OrderRepository;
import com.example.spring_boot.repository.orders.OrderItemRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final MongoTemplate mongoTemplate;

    /** Tạo order mới. */
    public Order createOrder(String userId, String address, String paymentMethod, List<OrderItem> orderItems) {
        log.info("Creating new order for user: {}", userId);
        try {
            // Tính tổng tiền
            BigDecimal totalAmount = calculateTotalAmount(orderItems);
            
            // Tạo order trước
            Order order = Order.builder()
                    .userId(userId)
                    .totalAmount(totalAmount)
                    .status("pending")
                    .address(address)
                    .paymentMethod(paymentMethod)
                    .createdAt(Instant.now())
                    .build();
            
            Order savedOrder = orderRepository.save(order);
            
            // Lưu order items riêng biệt với orderId
            for (OrderItem item : orderItems) {
                item.setOrderId(savedOrder.getId());
                item.setCreatedAt(Instant.now());
                orderItemRepository.save(item);
            }
            
            log.info("Order created successfully with ID: {} and {} items", savedOrder.getId(), orderItems.size());
            return savedOrder;
        } catch (Exception e) {
            log.error("createOrder failed, userId={}", userId, e);
            throw new RuntimeException("Failed to create order: " + e.getMessage(), e);
        }
    }

    /** Cập nhật order. */
    public Order updateOrder(String id, String status, String address, String paymentMethod) {
        log.info("Updating order - ID: {}, Status: '{}'", id, status);
        
        Order existingOrder = orderRepository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new RuntimeException("Order not found with ID: " + id));
        
        // Cập nhật thông tin
        if (status != null) existingOrder.setStatus(status);
        if (address != null) existingOrder.setAddress(address);
        if (paymentMethod != null) existingOrder.setPaymentMethod(paymentMethod);
        existingOrder.setUpdatedAt(Instant.now());
        
        // Lưu vào database
        orderRepository.save(existingOrder);
        
        log.info("Order updated successfully - ID: {}, Status: '{}'", id, status);
        return existingOrder;
    }

    /** Xóa mềm order. */
    public void deleteOrder(String id) {
        log.info("Soft deleting order with ID: {}", id);
        try {
            Order order = orderRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Order not found with ID: " + id));
            
            if (order.getDeletedAt() != null) {
                throw new RuntimeException("Order has been deleted");
            }
            
            order.setDeletedAt(Instant.now());
            orderRepository.save(order);
            log.info("Order soft deleted successfully");
        } catch (Exception e) {
            log.error("deleteOrder failed, id={}", id, e);
            throw new RuntimeException("Failed to delete order: " + e.getMessage(), e);
        }
    }

    /** Lấy order theo ID. */
    @Transactional(readOnly = true)
    public Order getOrderById(String id) {
        log.info("Getting order by ID: {}", id);
        try {
            Order order = orderRepository.findByIdAndDeletedAtIsNull(id)
                    .orElseThrow(() -> new RuntimeException("Order not found with ID: " + id));
            return order;
        } catch (Exception e) {
            log.error("getOrderById failed, id={}", id, e);
            throw new RuntimeException("Failed to get order: " + e.getMessage(), e);
        }
    }

    /** Lấy order items theo order ID. */
    @Transactional(readOnly = true)
    public List<OrderItem> getOrderItemsByOrderId(String orderId) {
        log.info("Getting order items for order: {}", orderId);
        try {
            return orderItemRepository.findByOrderIdAndDeletedAtIsNull(orderId);
        } catch (Exception e) {
            log.error("getOrderItemsByOrderId failed, orderId={}", orderId, e);
            throw new RuntimeException("Failed to get order items: " + e.getMessage(), e);
        }
    }

    /** Lấy order với items. */
    @Transactional(readOnly = true)
    public Map<String, Object> getOrderWithItems(String orderId) {
        log.info("Getting order with items: {}", orderId);
        try {
            Order order = getOrderById(orderId);
            List<OrderItem> orderItems = getOrderItemsByOrderId(orderId);
            
            Map<String, Object> result = new HashMap<>();
            result.put("order", order);
            result.put("items", orderItems);
            result.put("itemCount", orderItems.size());
            
            return result;
        } catch (Exception e) {
            log.error("getOrderWithItems failed, orderId={}", orderId, e);
            throw new RuntimeException("Failed to get order with items: " + e.getMessage(), e);
        }
    }

    /** Lấy orders theo user ID. */
    @Transactional(readOnly = true)
    public List<Order> getOrdersByUserId(String userId) {
        log.info("Getting orders for user: {}", userId);
        try {
            return orderRepository.findByUserIdAndDeletedAtIsNull(userId);
        } catch (Exception e) {
            log.error("getOrdersByUserId failed, userId={}", userId, e);
            throw new RuntimeException("Failed to get orders: " + e.getMessage(), e);
        }
    }

    /** Lấy orders theo status. */
    @Transactional(readOnly = true)
    public List<Order> getOrdersByStatus(String status) {
        log.info("Getting orders with status: {}", status);
        try {
            return orderRepository.findByStatusAndDeletedAtIsNull(status);
        } catch (Exception e) {
            log.error("getOrdersByStatus failed, status={}", status, e);
            throw new RuntimeException("Failed to get orders: " + e.getMessage(), e);
        }
    }

    /** Lấy tất cả orders active. */
    @Transactional(readOnly = true)
    public List<Order> getAllActiveOrders() {
        log.info("Getting all active orders");
        try {
            return orderRepository.findAllActive();
        } catch (Exception e) {
            log.error("getAllActiveOrders failed", e);
            throw new RuntimeException("Failed to get orders: " + e.getMessage(), e);
        }
    }

    /** Phân trang orders. */
    @Transactional(readOnly = true)
    public Page<Order> getOrdersWithPagination(Pageable pageable) {
        log.info("Getting orders with pagination: page={}, size={}", 
                pageable.getPageNumber(), pageable.getPageSize());
        
        try {
            Query query = new Query(Criteria.where("deletedAt").isNull());
            
            // Apply pagination
            query.skip(pageable.getOffset());
            query.limit(pageable.getPageSize());
            
            // Apply sorting
            if (pageable.getSort().isSorted()) {
                pageable.getSort().forEach(order -> {
                    query.with(org.springframework.data.domain.Sort.by(
                            order.getDirection(), order.getProperty()));
                });
            } else {
                query.with(org.springframework.data.domain.Sort.by("createdAt").descending());
            }
            
            List<Order> orders = mongoTemplate.find(query, Order.class);
            
            // Count total records
            long totalCount = mongoTemplate.count(new Query(Criteria.where("deletedAt").isNull()), Order.class);
            
            return new PageImpl<>(orders, pageable, totalCount);
        } catch (Exception e) {
            log.error("getOrdersWithPagination failed", e);
            throw new RuntimeException("Failed to paginate orders: " + e.getMessage(), e);
        }
    }

    /** Đếm orders theo user ID. */
    @Transactional(readOnly = true)
    public long countOrdersByUserId(String userId) {
        try {
            return orderRepository.countByUserIdAndDeletedAtIsNull(userId);
        } catch (Exception e) {
            log.error("countOrdersByUserId failed, userId={}", userId, e);
            throw new RuntimeException("Failed to count orders: " + e.getMessage(), e);
        }
    }

    /** Đếm orders theo status. */
    @Transactional(readOnly = true)
    public long countOrdersByStatus(String status) {
        try {
            return orderRepository.countByStatusAndDeletedAtIsNull(status);
        } catch (Exception e) {
            log.error("countOrdersByStatus failed, status={}", status, e);
            throw new RuntimeException("Failed to count orders: " + e.getMessage(), e);
        }
    }

    /** Lấy thống kê orders. */
    @Transactional(readOnly = true)
    public Map<String, Object> getOrderStatistics() {
        log.info("Getting order statistics");
        try {
            Map<String, Object> stats = new HashMap<>();
            
            // Đếm theo status
            stats.put("pending", countOrdersByStatus("pending"));
            stats.put("confirmed", countOrdersByStatus("confirmed"));
            stats.put("shipped", countOrdersByStatus("shipped"));
            stats.put("delivered", countOrdersByStatus("delivered"));
            stats.put("cancelled", countOrdersByStatus("cancelled"));
            
            // Tổng orders
            stats.put("total", mongoTemplate.count(new Query(Criteria.where("deletedAt").isNull()), Order.class));
            
            return stats;
        } catch (Exception e) {
            log.error("getOrderStatistics failed", e);
            throw new RuntimeException("Failed to get order statistics: " + e.getMessage(), e);
        }
    }

    // =====================================================
    // HELPER METHODS
    // =====================================================

    /** Tính tổng tiền của order items. */
    private BigDecimal calculateTotalAmount(List<OrderItem> orderItems) {
        return orderItems.stream()
                .map(item -> item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}

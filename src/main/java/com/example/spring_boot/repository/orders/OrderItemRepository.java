package com.example.spring_boot.repository.orders;

import com.example.spring_boot.domains.orders.OrderItem;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderItemRepository extends MongoRepository<OrderItem, String> {
    
    // Tìm order items theo order ID
    @Query("{ 'orderId': ?0, 'deletedAt': null }")
    List<OrderItem> findByOrderIdAndDeletedAtIsNull(String orderId);
    
    // Tìm order items theo product ID
    @Query("{ 'productId': ?0, 'deletedAt': null }")
    List<OrderItem> findByProductIdAndDeletedAtIsNull(String productId);
    
    // Tìm order item theo order ID và product ID
    @Query("{ 'orderId': ?0, 'productId': ?1, 'deletedAt': null }")
    Optional<OrderItem> findByOrderIdAndProductIdAndDeletedAtIsNull(String orderId, String productId);
    
    // Lấy tất cả order items chưa bị xóa
    @Query("{ 'deletedAt': null }")
    List<OrderItem> findAllActive();
    
    // Đếm số lượng order items theo order ID
    @Query(value = "{ 'orderId': ?0, 'deletedAt': null }", count = true)
    long countByOrderIdAndDeletedAtIsNull(String orderId);
    
    // Đếm số lượng order items theo product ID
    @Query(value = "{ 'productId': ?0, 'deletedAt': null }", count = true)
    long countByProductIdAndDeletedAtIsNull(String productId);
}

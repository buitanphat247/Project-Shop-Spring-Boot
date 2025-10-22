package com.example.spring_boot.repository.order;

import com.example.spring_boot.domains.order.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends MongoRepository<Order, String> {
    
    // Find by order number
    Optional<Order> findByOrderNumber(String orderNumber);
    
    // Find by user ID
    List<Order> findByUserId(String userId);
    
    // Find by user ID with pagination
    Page<Order> findByUserId(String userId, Pageable pageable);
    
    // Find by session ID
    List<Order> findBySessionId(String sessionId);
    
    // Find by status
    List<Order> findByStatus(String status);
    
    // Find by status with pagination
    Page<Order> findByStatus(String status, Pageable pageable);
    
    // Find by payment status
    List<Order> findByPaymentStatus(String paymentStatus);
    
    // Find by payment status with pagination
    Page<Order> findByPaymentStatus(String paymentStatus, Pageable pageable);
    
    // Find by user ID and status
    List<Order> findByUserIdAndStatus(String userId, String status);
    
    // Find by user ID and status with pagination
    Page<Order> findByUserIdAndStatus(String userId, String status, Pageable pageable);
    
    // Find by date range
    @Query("{ 'createdAt': { $gte: ?0, $lte: ?1 } }")
    List<Order> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    // Find by date range with pagination
    @Query("{ 'createdAt': { $gte: ?0, $lte: ?1 } }")
    Page<Order> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate, Pageable pageable);
    
    // Find by user ID and date range
    @Query("{ 'userId': ?0, 'createdAt': { $gte: ?1, $lte: ?2 } }")
    List<Order> findByUserIdAndCreatedAtBetween(String userId, LocalDateTime startDate, LocalDateTime endDate);
    
    // Find by user ID and date range with pagination
    @Query("{ 'userId': ?0, 'createdAt': { $gte: ?1, $lte: ?2 } }")
    Page<Order> findByUserIdAndCreatedAtBetween(String userId, LocalDateTime startDate, LocalDateTime endDate, Pageable pageable);
    
    // Find by transaction ID
    Optional<Order> findByTransactionId(String transactionId);
    
    // Find by phone number
    List<Order> findByPhone(String phone);
    
    // Find by phone number with pagination
    Page<Order> findByPhone(String phone, Pageable pageable);
    
    // Find by username containing
    @Query("{ 'username': { $regex: ?0, $options: 'i' } }")
    List<Order> findByUsernameContainingIgnoreCase(String username);
    
    // Find by username containing with pagination
    @Query("{ 'username': { $regex: ?0, $options: 'i' } }")
    Page<Order> findByUsernameContainingIgnoreCase(String username, Pageable pageable);
    
    // Count by status
    long countByStatus(String status);
    
    // Count by payment status
    long countByPaymentStatus(String paymentStatus);
    
    // Count by user ID
    long countByUserId(String userId);
    
    // Count by date range
    @Query(value = "{ 'createdAt': { $gte: ?0, $lte: ?1 } }", count = true)
    long countByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
}

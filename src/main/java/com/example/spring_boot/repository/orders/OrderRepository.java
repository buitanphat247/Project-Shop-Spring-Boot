package com.example.spring_boot.repository.orders;

import com.example.spring_boot.domains.orders.Order;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends MongoRepository<Order, String> {
    
    // Tìm order theo user ID và chưa bị xóa
    @Query("{ 'userId': ?0, 'deletedAt': null }")
    List<Order> findByUserIdAndDeletedAtIsNull(String userId);
    
    // Tìm order theo status và chưa bị xóa
    @Query("{ 'status': ?0, 'deletedAt': null }")
    List<Order> findByStatusAndDeletedAtIsNull(String status);
    
    // Tìm order theo user ID và status
    @Query("{ 'userId': ?0, 'status': ?1, 'deletedAt': null }")
    List<Order> findByUserIdAndStatusAndDeletedAtIsNull(String userId, String status);
    
    // Lấy tất cả order chưa bị xóa
    @Query("{ 'deletedAt': null }")
    List<Order> findAllActive();
    
    // Tìm order theo ID và chưa bị xóa
    @Query("{ '_id': ?0, 'deletedAt': null }")
    Optional<Order> findByIdAndDeletedAtIsNull(String id);
    
    // Đếm số lượng order theo user ID
    @Query(value = "{ 'userId': ?0, 'deletedAt': null }", count = true)
    long countByUserIdAndDeletedAtIsNull(String userId);
    
    // Đếm số lượng order theo status
    @Query(value = "{ 'status': ?0, 'deletedAt': null }", count = true)
    long countByStatusAndDeletedAtIsNull(String status);
}

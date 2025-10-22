package com.example.spring_boot.repository.cart;

import com.example.spring_boot.domains.cart.Cart;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartRepository extends MongoRepository<Cart, String> {
    
    // Find by user ID
    Optional<Cart> findByUserId(String userId);
    
    // Find by session ID
    Optional<Cart> findBySessionId(String sessionId);
    
    // Find by user ID or session ID
    @Query("{ $or: [{ 'userId': ?0 }, { 'sessionId': ?0 }] }")
    Optional<Cart> findByUserIdOrSessionId(String userIdOrSessionId);
    
    // Find all carts by user ID
    List<Cart> findAllByUserId(String userId);
    
    // Find all carts by session ID
    List<Cart> findAllBySessionId(String sessionId);
    
    // Check if cart exists by user ID
    boolean existsByUserId(String userId);
    
    // Check if cart exists by session ID
    boolean existsBySessionId(String sessionId);
    
    // Delete by user ID
    void deleteByUserId(String userId);
    
    // Delete by session ID
    void deleteBySessionId(String sessionId);
    
    // Find carts with items
    @Query("{ 'items': { $exists: true, $not: { $size: 0 } } }")
    List<Cart> findCartsWithItems();
    
    // Find empty carts
    @Query("{ $or: [{ 'items': { $exists: false } }, { 'items': { $size: 0 } }] }")
    List<Cart> findEmptyCarts();
}

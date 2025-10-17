package com.example.spring_boot.repository.products;

import com.example.spring_boot.domains.products.ProductLike;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductLikeRepository extends MongoRepository<ProductLike, String> {

    @Query("{ 'deletedAt': null, 'productId': ?0 }")
    List<ProductLike> findActiveByProductId(Object productId);

    @Query(value = "{ 'deletedAt': null, 'productId': ?0, 'userId': ?1 }", count = true)
    long countByProductIdAndUserId(Object productId, Object userId);
}



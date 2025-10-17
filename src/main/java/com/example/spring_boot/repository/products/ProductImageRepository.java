package com.example.spring_boot.repository.products;

import com.example.spring_boot.domains.products.ProductImage;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductImageRepository extends MongoRepository<ProductImage, String> {

    @Query("{ 'deletedAt': null, 'productId': ?0 }")
    List<ProductImage> findActiveByProductId(Object productId);
}



package com.example.spring_boot.repository.products;

import com.example.spring_boot.domains.products.ProductAttribute;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductAttributeRepository extends MongoRepository<ProductAttribute, String> {

    @Query("{ 'deletedAt': null, 'productId': ?0 }")
    List<ProductAttribute> findActiveByProductId(Object productId);
}



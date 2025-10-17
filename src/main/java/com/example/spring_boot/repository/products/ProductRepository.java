package com.example.spring_boot.repository.products;

import com.example.spring_boot.domains.products.Product;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends MongoRepository<Product, String> {

    @Query("{ 'deletedAt': null }")
    List<Product> findAllActive();

    @Query("{ 'name': { $regex: ?0, $options: 'i' }, 'deletedAt': null }")
    List<Product> findByNameContainingIgnoreCase(String name);
}



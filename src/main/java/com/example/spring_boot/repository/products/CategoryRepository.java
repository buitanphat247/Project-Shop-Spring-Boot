package com.example.spring_boot.repository.products;

import com.example.spring_boot.domains.products.Category;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends MongoRepository<Category, String> {
    
    // Tìm category theo tên (không phân biệt hoa thường)
    Optional<Category> findByNameIgnoreCase(String name);
    
    // Tìm category theo tên và không bị xóa
    Optional<Category> findByNameIgnoreCaseAndDeletedAtIsNull(String name);
    
    // Lấy tất cả category chưa bị xóa
    @Query("{ 'deletedAt': null }")
    List<Category> findAllActive();
    
    // Tìm kiếm category theo tên (chưa bị xóa)
    @Query("{ 'name': { $regex: ?0, $options: 'i' }, 'deletedAt': null }")
    List<Category> findByNameContainingIgnoreCase(String name);
    
    // Kiểm tra category có tồn tại và chưa bị xóa
    boolean existsByNameIgnoreCaseAndDeletedAtIsNull(String name);
    
    // Đếm số lượng category chưa bị xóa
    @Query(value = "{ 'deletedAt': null }", count = true)
    long countActive();
}
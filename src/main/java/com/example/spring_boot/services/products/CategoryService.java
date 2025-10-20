package com.example.spring_boot.services.products; // Package service quản lý danh mục sản phẩm

import com.example.spring_boot.domains.products.Category; // Entity danh mục
import com.example.spring_boot.repository.products.CategoryRepository; // Repository Mongo cho danh mục

import lombok.RequiredArgsConstructor; // Inject constructor cho field final
import lombok.extern.slf4j.Slf4j; // Hỗ trợ logging
import org.springframework.data.domain.Page; // Kết quả phân trang
import org.springframework.data.domain.PageImpl; // Page impl dựa trên danh sách
import org.springframework.data.domain.Pageable; // Đầu vào phân trang
import org.springframework.data.mongodb.core.MongoTemplate; // MongoDB template cho query tối ưu
import org.springframework.data.mongodb.core.query.Criteria; // Criteria cho query
import org.springframework.data.mongodb.core.query.Query; // Query builder
import org.springframework.stereotype.Service; // Bean service Spring
import org.springframework.transaction.annotation.Transactional; // Transaction wrapper

import java.time.Instant; // Thời điểm UTC
import java.util.List; // Danh sách kết quả
import java.util.Map; // Map cho kết quả
import java.util.HashMap; // HashMap implementation
import java.util.ArrayList; // ArrayList implementation
import org.bson.types.ObjectId; // ObjectId cho query
import com.example.spring_boot.domains.products.Product; // Entity sản phẩm

@Service // Đăng ký bean service
@RequiredArgsConstructor // Tạo constructor cho field final
@Slf4j // Bật logging
@Transactional // Transaction cho class
public class CategoryService {

    private final CategoryRepository categoryRepository; // DAO danh mục
    private final MongoTemplate mongoTemplate; // MongoDB template cho query tối ưu

    /** Tạo category mới. */
    public Category createCategory(String name, String description) {
        log.info("Creating new category: {}", name); // Log thao tác tạo
        try {
            // Kiểm tra tên category đã tồn tại chưa
            if (categoryRepository.existsByNameIgnoreCaseAndDeletedAtIsNull(name)) { // Trùng tên còn active
                throw new RuntimeException("Category with name '" + name + "' already exists");
            }
            Category category = Category.builder()
                    .name(name) // Gán tên
                    .description(description) // Gán mô tả
                    .createdAt(Instant.now()) // Thời điểm tạo
                    .build();
            Category savedCategory = categoryRepository.save(category); // Lưu entity
            log.info("Category created successfully with ID: {}", savedCategory.getId()); // Log thành công
            return savedCategory; // Trả về kết quả
        } catch (Exception e) {
            log.error("createCategory failed, name={}", name, e); // Log lỗi
            throw new RuntimeException("Failed to create category: " + e.getMessage(), e); // Bao lỗi nghiệp vụ
        }
    }

    /** Cập nhật category. */
    public Category updateCategory(String id, String name, String description) {
        log.info("Updating category with ID: {}", id); // Log thao tác cập nhật
        try {
            Category existingCategory = categoryRepository.findById(id) // Tìm theo id
                    .orElseThrow(() -> new RuntimeException("Category not found with ID: " + id)); // Không thấy -> lỗi
            // Kiểm tra nếu category đã bị xóa
            if (existingCategory.getDeletedAt() != null) {
                throw new RuntimeException("Category has been deleted"); // Đã xóa mềm -> chặn thao tác
            }
            // Kiểm tra tên mới có trùng với category khác không
            if (!existingCategory.getName().equalsIgnoreCase(name) &&
                    categoryRepository.existsByNameIgnoreCaseAndDeletedAtIsNull(name)) { // Xung đột tên
                throw new RuntimeException("Category with name '" + name + "' already exists");
            }
            existingCategory.setName(name); // Cập nhật tên
            existingCategory.setDescription(description); // Cập nhật mô tả
            existingCategory.setUpdatedAt(Instant.now()); // Gán thời điểm cập nhật
            Category updatedCategory = categoryRepository.save(existingCategory); // Lưu thay đổi
            log.info("Category updated successfully"); // Log thành công
            return updatedCategory; // Trả về kết quả
        } catch (Exception e) {
            log.error("updateCategory failed, id={}", id, e); // Log lỗi
            throw new RuntimeException("Failed to update category: " + e.getMessage(), e); // Bao lỗi nghiệp vụ
        }
    }

    /** Xóa mềm category. */
    public void deleteCategory(String id) {
        log.info("Soft deleting category with ID: {}", id); // Log thao tác xóa mềm
        try {
            Category category = categoryRepository.findById(id) // Tìm theo id
                    .orElseThrow(() -> new RuntimeException("Category not found with ID: " + id)); // Không thấy -> lỗi
            if (category.getDeletedAt() != null)
                throw new RuntimeException("Category has been deleted"); // Đã xóa mềm -> chặn thao tác lặp
            category.setDeletedAt(Instant.now()); // Đánh dấu xóa mềm
            categoryRepository.save(category); // Lưu thay đổi
            log.info("Category soft deleted successfully"); // Log thành công
        } catch (Exception e) {
            log.error("deleteCategory failed, id={}", id, e); // Log lỗi
            throw new RuntimeException("Failed to delete category: " + e.getMessage(), e); // Bao lỗi nghiệp vụ
        }
    }

    /** Khôi phục category đã bị xóa. */
    public Category restoreCategory(String id) {
        log.info("Restoring category with ID: {}", id); // Log thao tác khôi phục
        try {
            Category category = categoryRepository.findById(id) // Tìm theo id
                    .orElseThrow(() -> new RuntimeException("Category not found with ID: " + id)); // Không thấy -> lỗi
            if (category.getDeletedAt() == null)
                throw new RuntimeException("Category has not been deleted"); // Chưa xóa -> thao tác không hợp lệ
            category.setDeletedAt(null); // Bỏ cờ xóa mềm
            category.setUpdatedAt(Instant.now()); // Gán thời điểm cập nhật
            Category restoredCategory = categoryRepository.save(category); // Lưu thay đổi
            log.info("Category restored successfully"); // Log thành công
            return restoredCategory; // Trả về kết quả
        } catch (Exception e) {
            log.error("restoreCategory failed, id={}", id, e); // Log lỗi
            throw new RuntimeException("Failed to restore category: " + e.getMessage(), e); // Bao lỗi nghiệp vụ
        }
    }

    /** Lấy category theo ID. */
    @Transactional(readOnly = true)
    public Category getCategoryById(String id) {
        log.info("Getting category by ID: {}", id); // Log truy vấn
        try {
            Category category = categoryRepository.findById(id) // Tìm theo id
                    .orElseThrow(() -> new RuntimeException("Category not found with ID: " + id)); // Không thấy -> lỗi
            if (category.getDeletedAt() != null)
                throw new RuntimeException("Category has been deleted"); // Đã xóa mềm -> không trả về
            return category; // Trả về entity
        } catch (Exception e) {
            log.error("getCategoryById failed, id={}", id, e); // Log lỗi
            throw new RuntimeException("Failed to get category: " + e.getMessage(), e); // Bao lỗi nghiệp vụ
        }
    }

    /** Lấy tất cả category đang hoạt động - TỐI ƯU HÓA với projection. */
    @Transactional(readOnly = true)
    public List<Category> getAllActiveCategories() {
        long startTime = System.currentTimeMillis();
        log.info("🚀 [PERFORMANCE] Getting all active categories with optimization");
        
        try {
            // Sử dụng MongoTemplate với projection để chỉ lấy fields cần thiết
            Query query = new Query(Criteria.where("deletedAt").isNull());
            query.fields().include("name", "description", "createdAt", "updatedAt");
            
            List<Category> categories = mongoTemplate.find(query, Category.class);
            
            long endTime = System.currentTimeMillis();
            log.info("✅ [PERFORMANCE] Retrieved {} categories in {}ms", categories.size(), endTime - startTime);
            return categories;
        } catch (Exception e) {
            log.error("❌ [PERFORMANCE] getAllActiveCategories failed", e); // Log lỗi
            throw new RuntimeException("Failed to list categories: " + e.getMessage(), e); // Bao lỗi nghiệp vụ
        }
    }

    /** Tìm kiếm category theo tên - TỐI ƯU HÓA với compound query. */
    @Transactional(readOnly = true)
    public List<Category> searchCategoriesByName(String name) {
        long startTime = System.currentTimeMillis();
        log.info("🔍 [PERFORMANCE] Searching categories by name: {}", name);
        
        try {
            Query query = new Query();
            
            if (name == null || name.trim().isEmpty()) {
                query.addCriteria(Criteria.where("deletedAt").isNull());
            } else {
                query.addCriteria(Criteria.where("deletedAt").isNull())
                     .addCriteria(Criteria.where("name").regex(name, "i"));
            }
            
            query.fields().include("name", "description", "createdAt", "updatedAt");
            
            List<Category> categories = mongoTemplate.find(query, Category.class);
            
            long endTime = System.currentTimeMillis();
            log.info("✅ [PERFORMANCE] Found {} categories matching '{}' in {}ms", 
                    categories.size(), name, endTime - startTime);
            return categories;
        } catch (Exception e) {
            log.error("❌ [PERFORMANCE] searchCategoriesByName failed, name={}", name, e); // Log lỗi
            throw new RuntimeException("Failed to search categories: " + e.getMessage(), e); // Bao lỗi nghiệp vụ
        }
    }

    /** Phân trang category active - TỐI ƯU HÓA với skip/limit. */
    @Transactional(readOnly = true)
    public Page<Category> getCategoriesWithPagination(Pageable pageable) {
        long startTime = System.currentTimeMillis();
        log.info("📄 [PERFORMANCE] Getting categories with pagination: page={}, size={}",
                pageable.getPageNumber(), pageable.getPageSize());
        
        try {
            Query query = new Query(Criteria.where("deletedAt").isNull());
            query.fields().include("name", "description", "createdAt", "updatedAt");
            
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
            
            List<Category> categories = mongoTemplate.find(query, Category.class);
            
            // Count total records
            long totalCount = getTotalActiveCount();
            
            long endTime = System.currentTimeMillis();
            log.info("✅ [PERFORMANCE] Retrieved {} categories for page {} in {}ms", 
                    categories.size(), pageable.getPageNumber(), endTime - startTime);
            
            return new PageImpl<>(categories, pageable, totalCount);
        } catch (Exception e) {
            log.error("❌ [PERFORMANCE] getCategoriesWithPagination failed, page={}, size={}", 
                    pageable.getPageNumber(), pageable.getPageSize(), e);
            throw new RuntimeException("Failed to paginate categories: " + e.getMessage(), e);
        }
    }

    /** Đếm số lượng category đang hoạt động - TỐI ƯU HÓA với count query. */
    @Transactional(readOnly = true)
    public long countActiveCategories() {
        long startTime = System.currentTimeMillis();
        log.info("📊 [PERFORMANCE] Counting active categories");
        
        try {
            Query countQuery = new Query(Criteria.where("deletedAt").isNull());
            long count = mongoTemplate.count(countQuery, Category.class);
            
            long endTime = System.currentTimeMillis();
            log.info("✅ [PERFORMANCE] Counted {} active categories in {}ms", count, endTime - startTime);
            return count;
        } catch (Exception e) {
            log.error("❌ [PERFORMANCE] countActiveCategories failed", e);
            throw new RuntimeException("Failed to count categories: " + e.getMessage(), e);
        }
    }

    // =====================================================
    // HELPER METHODS - Các phương thức hỗ trợ tối ưu hóa
    // =====================================================

    /**
     * Get total count of active categories
     * Tối ưu: Sử dụng count query với index
     */
    private long getTotalActiveCount() {
        Query countQuery = new Query(Criteria.where("deletedAt").isNull());
        return mongoTemplate.count(countQuery, Category.class);
    }

    /**
     * Lấy danh sách categories với số lượng sản phẩm
     */
    @Transactional(readOnly = true)
    public List<Map<String, Object>> getAllActiveCategoriesWithProductCount() {
        long startTime = System.currentTimeMillis();
        log.info("📊 [PERFORMANCE] Getting categories with product counts");

        try {
            // Lấy tất cả categories active
            List<Category> categories = getAllActiveCategories();
            
            // Tạo danh sách kết quả với product count
            List<Map<String, Object>> result = new ArrayList<>();
            
            for (Category category : categories) {
                Map<String, Object> categoryWithCount = new HashMap<>();
                categoryWithCount.put("id", category.getId());
                categoryWithCount.put("name", category.getName());
                categoryWithCount.put("description", category.getDescription());
                categoryWithCount.put("createdAt", category.getCreatedAt());
                categoryWithCount.put("updatedAt", category.getUpdatedAt());
                categoryWithCount.put("deletedAt", category.getDeletedAt());
                
                // Đếm số sản phẩm cho category này
                long productCount = getProductCountForCategory(category.getId());
                categoryWithCount.put("count", productCount);
                
                result.add(categoryWithCount);
            }
            
            long endTime = System.currentTimeMillis();
            log.info("✅ [PERFORMANCE] Retrieved {} categories with product counts in {}ms", 
                    result.size(), endTime - startTime);
            
            return result;
        } catch (Exception e) {
            log.error("❌ [PERFORMANCE] Failed to get categories with product counts", e);
            throw new RuntimeException("Failed to get categories with product counts: " + e.getMessage(), e);
        }
    }

    /**
     * Đếm số sản phẩm cho một category
     */
    @Transactional(readOnly = true)
    public long getProductCountForCategory(String categoryId) {
        try {
            ObjectId categoryObjectId = new ObjectId(categoryId);
            Query query = new Query(Criteria.where("categoryId").is(categoryObjectId)
                    .and("deletedAt").isNull());
            return mongoTemplate.count(query, Product.class);
        } catch (Exception e) {
            log.warn("🔄 [DEBUG] Invalid categoryId format: {}", categoryId);
            return 0;
        }
    }
}
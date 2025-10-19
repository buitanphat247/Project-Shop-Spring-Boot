package com.example.spring_boot.services.products; // Package service quản lý sản phẩm

import com.example.spring_boot.domains.products.Product; // Entity sản phẩm
import com.example.spring_boot.domains.products.Category; // Entity danh mục
import com.example.spring_boot.repository.products.ProductRepository; // Repository Mongo cho sản phẩm
import com.example.spring_boot.repository.products.CategoryRepository; // Repository danh mục

import lombok.RequiredArgsConstructor; // Inject constructor cho field final
import lombok.extern.slf4j.Slf4j; // Hỗ trợ logging
import org.springframework.data.domain.Page; // Kết quả phân trang
import org.springframework.data.domain.PageImpl; // Triển khai Page từ danh sách
import org.springframework.data.domain.Pageable; // Đầu vào phân trang
import org.springframework.data.mongodb.core.MongoTemplate; // MongoDB template cho query tối ưu
import org.springframework.data.mongodb.core.query.Criteria; // Criteria cho query
import org.springframework.data.mongodb.core.query.Query; // Query builder
import org.springframework.stereotype.Service; // Bean service Spring
import org.springframework.transaction.annotation.Transactional; // Transaction wrapper

import java.time.Instant; // Thời điểm UTC
import java.util.List; // Danh sách kết quả
import java.util.Map; // Map cho batch operations
import java.util.stream.Collectors; // Stream operations

@Service // Đăng ký bean service
@RequiredArgsConstructor // Tạo constructor cho field final
@Slf4j // Bật logging
@Transactional // Transaction cho class
public class ProductService {

    private final ProductRepository productRepository; // DAO sản phẩm
    private final CategoryRepository categoryRepository; // DAO danh mục
    private final MongoTemplate mongoTemplate; // MongoDB template cho query tối ưu

    /** Tạo product mới: reset id, set createdAt, lưu DB. */
    public Product create(Product product) {
        try {
            // Validate categoryId nếu có (cho phép bỏ trống)
            if (product.getCategoryId() != null) {
                if (!categoryRepository.existsById(product.getCategoryId().toHexString())) {
                    throw new RuntimeException("Category not found");
                }
            }

            product.setId(null); // Reset id để luôn tạo mới
            product.setCreatedAt(Instant.now()); // Gán thời điểm tạo
            Product savedProduct = productRepository.save(product); // Lưu và nhận entity đã lưu

            // Populate category nếu DocumentReference không tự động load
            // if (savedProduct.getCategory() == null && savedProduct.getCategoryId() !=
            // null) {
            // categoryRepository.findById(savedProduct.getCategoryId().toHexString())
            // .ifPresent(savedProduct::setCategory);
            // }

            return savedProduct; // Trả về entity đã lưu
        } catch (Exception e) {
            log.error("Create product failed, name={}", product != null ? product.getName() : null, e); // Log ngữ cảnh
            throw new RuntimeException("Failed to create product: " + e.getMessage(), e); // Bao lỗi nghiệp vụ
        }
    }

    /** Cập nhật product (chặn nếu đã bị xóa mềm). */
    public Product update(String id, Product updated) {
        try {
            Product existing = productRepository.findById(id) // Tìm theo id
                    .orElseThrow(() -> new RuntimeException("Product not found with ID: " + id)); // Không thấy -> 404
            if (existing.getDeletedAt() != null)
                throw new RuntimeException("Product has been deleted"); // Đã xóa mềm -> chặn cập nhật

            // Validate categoryId nếu có thay đổi
            if (updated.getCategoryId() != null && !updated.getCategoryId().equals(existing.getCategoryId())) {
                if (!categoryRepository.existsById(updated.getCategoryId().toHexString())) {
                    throw new RuntimeException("Category not found");
                }
                existing.setCategoryId(updated.getCategoryId()); // Cập nhật danh mục
            }

            existing.setName(updated.getName()); // Cập nhật tên
            existing.setDescription(updated.getDescription()); // Cập nhật mô tả
            existing.setPrice(updated.getPrice()); // Cập nhật giá
            existing.setStock(updated.getStock()); // Cập nhật tồn
            existing.setUpdatedAt(Instant.now()); // Gán thời điểm cập nhật

            Product savedProduct = productRepository.save(existing); // Lưu thay đổi

            // Populate category nếu DocumentReference không tự động load
            if (savedProduct.getCategory() == null && savedProduct.getCategoryId() != null) {
                categoryRepository.findById(savedProduct.getCategoryId().toHexString())
                        .ifPresent(savedProduct::setCategory);
            }

            return savedProduct; // Trả về kết quả
        } catch (Exception e) {
            log.error("Update product failed, id={}", id, e); // Log ngữ cảnh
            throw new RuntimeException("Failed to update product: " + e.getMessage(), e); // Bao lỗi nghiệp vụ
        }
    }

    /** Xóa mềm product. */
    public void softDelete(String id) {
        try {
            Product existing = productRepository.findById(id) // Tìm theo id
                    .orElseThrow(() -> new RuntimeException("Product not found with ID: " + id)); // Không thấy -> lỗi
            if (existing.getDeletedAt() != null)
                throw new RuntimeException("Product has been deleted"); // Đã xóa mềm -> chặn thao tác lặp
            existing.setDeletedAt(Instant.now()); // Đánh dấu xóa mềm
            productRepository.save(existing); // Lưu thay đổi
        } catch (Exception e) {
            log.error("Soft delete product failed, id={}", id, e); // Log ngữ cảnh lỗi
            throw new RuntimeException("Failed to soft delete product: " + e.getMessage(), e); // Bao lỗi nghiệp vụ
        }
    }

    @Transactional(readOnly = true)
    /** Lấy product theo id (chỉ trả về nếu chưa bị xóa mềm). */
    public Product getById(String id) {
        try {
            Product p = productRepository.findById(id) // Tìm theo id
                    .orElseThrow(() -> new RuntimeException("Product not found with ID: " + id)); // Không thấy -> 404
            if (p.getDeletedAt() != null)
                throw new RuntimeException("Product has been deleted"); // Đã xóa mềm -> không trả về

            // Populate category nếu DocumentReference không tự động load
            if (p.getCategory() == null && p.getCategoryId() != null) {
                categoryRepository.findById(p.getCategoryId().toHexString())
                        .ifPresent(p::setCategory);
            }

            return p; // Trả về entity
        } catch (Exception e) {
            log.error("Get product by id failed, id={}", id, e); // Log lỗi
            throw new RuntimeException("Failed to get product: " + e.getMessage(), e); // Bao lỗi nghiệp vụ
        }
    }

    @Transactional(readOnly = true)
    /** Lấy toàn bộ sản phẩm đang hoạt động - TỐI ƯU HÓA với batch loading. */
    public List<Product> getAllActive() {
        long startTime = System.currentTimeMillis();
        log.info("🚀 [PERFORMANCE] Getting all active products with batch optimization");

        try {
            // Sử dụng MongoTemplate với projection để chỉ lấy fields cần thiết
            Query query = new Query(Criteria.where("deletedAt").isNull());
            query.fields().include("name", "description", "price", "stock", "categoryId", "createdAt", "updatedAt");

            List<Product> products = mongoTemplate.find(query, Product.class);
            log.info("📊 [PERFORMANCE] Found {} products in {}ms", products.size(),
                    System.currentTimeMillis() - startTime);

            // BATCH LOADING: Load tất cả categories trong 1 query thay vì N+1 queries
            batchPopulateCategories(products);

            long endTime = System.currentTimeMillis();
            log.info("✅ [PERFORMANCE] Completed in {}ms", endTime - startTime);
            return products; // Trả về danh sách đã populate
        } catch (Exception e) {
            log.error("❌ [PERFORMANCE] Get all active products failed", e); // Log lỗi
            throw new RuntimeException("Failed to list products: " + e.getMessage(), e); // Bao lỗi nghiệp vụ
        }
    }

    @Transactional(readOnly = true)
    /** Tìm kiếm theo tên (ignore-case) - TỐI ƯU HÓA với compound query. */
    public List<Product> searchByName(String name) {
        long startTime = System.currentTimeMillis();
        log.info("🔍 [PERFORMANCE] Searching products by name: {}", name);

        try {
            // Sử dụng MongoTemplate với compound query tối ưu
            Query query = new Query();

            if (name == null || name.trim().isEmpty()) {
                // Nếu search term rỗng, lấy tất cả active products
                query.addCriteria(Criteria.where("deletedAt").isNull());
            } else {
                // Compound query: name search + soft delete filter
                query.addCriteria(Criteria.where("deletedAt").isNull())
                        .addCriteria(Criteria.where("name").regex(name, "i")); // Case-insensitive regex
            }

            // Projection để chỉ lấy fields cần thiết
            query.fields().include("name", "description", "price", "stock", "categoryId", "createdAt");

            List<Product> products = mongoTemplate.find(query, Product.class);
            log.info("📊 [PERFORMANCE] Found {} products matching '{}' in {}ms",
                    products.size(), name, System.currentTimeMillis() - startTime);

            // BATCH LOADING: Load tất cả categories trong 1 query
            batchPopulateCategories(products);

            long endTime = System.currentTimeMillis();
            log.info("✅ [PERFORMANCE] Search completed in {}ms", endTime - startTime);
            return products; // Trả về danh sách đã populate
        } catch (Exception e) {
            log.error("❌ [PERFORMANCE] Search products failed, name={}", name, e); // Log lỗi
            throw new RuntimeException("Failed to search products: " + e.getMessage(), e); // Bao lỗi nghiệp vụ
        }
    }

    @Transactional(readOnly = true)
    /** Lấy sản phẩm theo categoryId - TỐI ƯU HÓA với compound index. */
    public List<Product> getByCategoryId(String categoryId) {
        long startTime = System.currentTimeMillis();
        log.info("📂 [PERFORMANCE] Getting products by category: {}", categoryId);

        try {
            // Sử dụng compound query tối ưu cho category + soft delete
            Query query = new Query(Criteria.where("categoryId").is(categoryId)
                    .and("deletedAt").isNull());

            // Projection để chỉ lấy fields cần thiết
            query.fields().include("name", "description", "price", "stock", "categoryId", "createdAt");

            List<Product> products = mongoTemplate.find(query, Product.class);
            log.info("📊 [PERFORMANCE] Found {} products in category {} in {}ms",
                    products.size(), categoryId, System.currentTimeMillis() - startTime);

            // BATCH LOADING: Load tất cả categories trong 1 query
            batchPopulateCategories(products);

            long endTime = System.currentTimeMillis();
            log.info("✅ [PERFORMANCE] Category query completed in {}ms", endTime - startTime);
            return products; // Trả về danh sách đã populate
        } catch (Exception e) {
            log.error("❌ [PERFORMANCE] Get products by categoryId failed, categoryId={}", categoryId, e); // Log lỗi
            throw new RuntimeException("Failed to get products by category: " + e.getMessage(), e); // Bao lỗi nghiệp vụ
        }
    }

    @Transactional(readOnly = true)
    /** Phân trang sản phẩm active - TỐI ƯU HÓA với skip/limit. */
    public Page<Product> getPaged(Pageable pageable) {
        long startTime = System.currentTimeMillis();
        log.info("📄 [PERFORMANCE] Getting paged products: page={}, size={}",
                pageable.getPageNumber(), pageable.getPageSize());

        try {
            // Sử dụng skip/limit thay vì load tất cả rồi slice
            Query query = new Query(Criteria.where("deletedAt").isNull());

            // Projection để chỉ lấy fields cần thiết
            query.fields().include("name", "description", "price", "stock", "categoryId", "createdAt", "updatedAt");

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
                // Default sort by creation time descending
                query.with(org.springframework.data.domain.Sort.by("createdAt").descending());
            }

            List<Product> products = mongoTemplate.find(query, Product.class);
            log.info("📊 [PERFORMANCE] Retrieved {} products for page {} in {}ms",
                    products.size(), pageable.getPageNumber(), System.currentTimeMillis() - startTime);

            // Count total records (separate query for efficiency)
            long totalCount = getTotalActiveCount();

            // BATCH LOADING: Load tất cả categories trong 1 query
            batchPopulateCategories(products);

            long endTime = System.currentTimeMillis();
            log.info("✅ [PERFORMANCE] Pagination completed in {}ms", endTime - startTime);

            return new PageImpl<>(products, pageable, totalCount); // Trả về Page
        } catch (Exception e) {
            log.error("❌ [PERFORMANCE] Get paged products failed, page={}, size={}",
                    pageable.getPageNumber(), pageable.getPageSize(), e); // Log lỗi
            throw new RuntimeException("Failed to paginate products: " + e.getMessage(), e); // Bao lỗi nghiệp vụ
        }
    }

    // =====================================================
    // HELPER METHODS - Các phương thức hỗ trợ tối ưu hóa
    // =====================================================

    /**
     * Batch populate categories để tránh N+1 problem
     * Tối ưu: Single query để load tất cả categories cần thiết
     */
    private void batchPopulateCategories(List<Product> products) {
        if (products.isEmpty())
            return;

        long startTime = System.currentTimeMillis();

        // Collect unique category IDs
        List<String> categoryIds = products.stream()
                .map(Product::getCategoryId)
                .filter(id -> id != null)
                .map(Object::toString)
                .distinct()
                .collect(Collectors.toList());

        if (categoryIds.isEmpty())
            return;

        // Batch load all categories in single query
        Query categoryQuery = new Query(Criteria.where("_id").in(categoryIds));
        List<Category> categories = mongoTemplate.find(categoryQuery, Category.class);

        // Create lookup map
        Map<String, Category> categoryMap = categories.stream()
                .collect(Collectors.toMap(Category::getId, cat -> cat));

        // Populate categories
        products.forEach(product -> {
            if (product.getCategoryId() != null) {
                String categoryIdStr = product.getCategoryId().toString();
                Category category = categoryMap.get(categoryIdStr);
                if (category != null) {
                    product.setCategory(category);
                }
            }
        });

        long endTime = System.currentTimeMillis();
        log.debug("🔄 [PERFORMANCE] Batch populated {} categories in {}ms",
                categories.size(), endTime - startTime);
    }

    /**
     * Get total count of active products
     * Tối ưu: Sử dụng count query với index
     */
    private long getTotalActiveCount() {
        Query countQuery = new Query(Criteria.where("deletedAt").isNull());
        return mongoTemplate.count(countQuery, Product.class);
    }

    /**
     * Tạo thống kê sản phẩm với aggregation
     * Tối ưu: Single aggregation query cho multiple statistics
     */
    @Transactional(readOnly = true)
    public Map<String, Object> getProductStatistics() {
        log.info("📈 [PERFORMANCE] Getting product statistics");
        long startTime = System.currentTimeMillis();

        try {
            // Sử dụng aggregation để tính toán statistics trong 1 query
            org.springframework.data.mongodb.core.aggregation.Aggregation aggregation = org.springframework.data.mongodb.core.aggregation.Aggregation
                    .newAggregation(
                            // Match active products only
                            org.springframework.data.mongodb.core.aggregation.Aggregation.match(
                                    Criteria.where("deletedAt").isNull()),

                            // Group and calculate statistics
                            org.springframework.data.mongodb.core.aggregation.Aggregation.group()
                                    .count().as("totalProducts")
                                    .avg("price").as("averagePrice")
                                    .sum("stock").as("totalStock")
                                    .min("price").as("minPrice")
                                    .max("price").as("maxPrice"),

                            // Project results
                            org.springframework.data.mongodb.core.aggregation.Aggregation.project()
                                    .and("totalProducts").as("totalProducts")
                                    .and("averagePrice").as("averagePrice")
                                    .and("totalStock").as("totalStock")
                                    .and("minPrice").as("minPrice")
                                    .and("maxPrice").as("maxPrice"));

            @SuppressWarnings("rawtypes")
            org.springframework.data.mongodb.core.aggregation.AggregationResults<Map> results = mongoTemplate
                    .aggregate(aggregation, "products", Map.class);

            @SuppressWarnings("unchecked")
            Map<String, Object> stats = (Map<String, Object>) results.getUniqueMappedResult();
            if (stats == null) {
                stats = Map.of(
                        "totalProducts", 0L,
                        "averagePrice", 0.0,
                        "totalStock", 0L,
                        "minPrice", 0.0,
                        "maxPrice", 0.0);
            }

            long endTime = System.currentTimeMillis();
            log.info("✅ [PERFORMANCE] Statistics completed in {}ms: {}", endTime - startTime, stats);
            return stats;

        } catch (Exception e) {
            log.error("❌ [PERFORMANCE] Error getting statistics", e);
            throw new RuntimeException("Failed to get statistics: " + e.getMessage(), e);
        }
    }
}

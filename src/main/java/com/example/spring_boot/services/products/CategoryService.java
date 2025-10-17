package com.example.spring_boot.services.products;

import com.example.spring_boot.domains.products.Category;
import com.example.spring_boot.repository.products.CategoryRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class CategoryService {
    
    private final CategoryRepository categoryRepository;
    
    /**
     * Tạo category mới
     */
    public Category createCategory(String name, String description) {
        log.info("Creating new category: {}", name);
        try {
            // Kiểm tra tên category đã tồn tại chưa
            if (categoryRepository.existsByNameIgnoreCaseAndDeletedAtIsNull(name)) {
                throw new RuntimeException("Category with name '" + name + "' already exists");
            }
            Category category = Category.builder()
                    .name(name)
                    .description(description)
                    .createdAt(Instant.now())
                    .build();
            Category savedCategory = categoryRepository.save(category);
            log.info("Category created successfully with ID: {}", savedCategory.getId());
            return savedCategory;
        } catch (Exception e) {
            log.error("createCategory failed, name={}", name, e);
            throw new RuntimeException("Failed to create category: " + e.getMessage(), e);
        }
    }
    
    /**
     * Cập nhật category
     */
    public Category updateCategory(String id, String name, String description) {
        log.info("Updating category with ID: {}", id);
        try {
            Category existingCategory = categoryRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Category not found with ID: " + id));
            // Kiểm tra nếu category đã bị xóa
            if (existingCategory.getDeletedAt() != null) {
                throw new RuntimeException("Category has been deleted");
            }
            // Kiểm tra tên mới có trùng với category khác không
            if (!existingCategory.getName().equalsIgnoreCase(name) &&
                    categoryRepository.existsByNameIgnoreCaseAndDeletedAtIsNull(name)) {
                throw new RuntimeException("Category with name '" + name + "' already exists");
            }
            existingCategory.setName(name);
            existingCategory.setDescription(description);
            existingCategory.setUpdatedAt(Instant.now());
            Category updatedCategory = categoryRepository.save(existingCategory);
            log.info("Category updated successfully");
            return updatedCategory;
        } catch (Exception e) {
            log.error("updateCategory failed, id={}", id, e);
            throw new RuntimeException("Failed to update category: " + e.getMessage(), e);
        }
    }
    
    /**
     * Xóa mềm category
     */
    public void deleteCategory(String id) {
        log.info("Soft deleting category with ID: {}", id);
        try {
            Category category = categoryRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Category not found with ID: " + id));
            if (category.getDeletedAt() != null) throw new RuntimeException("Category has been deleted");
            category.setDeletedAt(Instant.now());
            categoryRepository.save(category);
            log.info("Category soft deleted successfully");
        } catch (Exception e) {
            log.error("deleteCategory failed, id={}", id, e);
            throw new RuntimeException("Failed to delete category: " + e.getMessage(), e);
        }
    }
    
    /**
     * Khôi phục category đã bị xóa
     */
    public Category restoreCategory(String id) {
        log.info("Restoring category with ID: {}", id);
        try {
            Category category = categoryRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Category not found with ID: " + id));
            if (category.getDeletedAt() == null) throw new RuntimeException("Category has not been deleted");
            category.setDeletedAt(null);
            category.setUpdatedAt(Instant.now());
            Category restoredCategory = categoryRepository.save(category);
            log.info("Category restored successfully");
            return restoredCategory;
        } catch (Exception e) {
            log.error("restoreCategory failed, id={}", id, e);
            throw new RuntimeException("Failed to restore category: " + e.getMessage(), e);
        }
    }
    
    /**
     * Lấy category theo ID
     */
    @Transactional(readOnly = true)
    public Category getCategoryById(String id) {
        log.info("Getting category by ID: {}", id);
        try {
            Category category = categoryRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Category not found with ID: " + id));
            if (category.getDeletedAt() != null) throw new RuntimeException("Category has been deleted");
            return category;
        } catch (Exception e) {
            log.error("getCategoryById failed, id={}", id, e);
            throw new RuntimeException("Failed to get category: " + e.getMessage(), e);
        }
    }
    
    /**
     * Lấy tất cả category đang hoạt động
     */
    @Transactional(readOnly = true)
    public List<Category> getAllActiveCategories() {
        log.info("Getting all active categories");
        try {
            return categoryRepository.findAllActive();
        } catch (Exception e) {
            log.error("getAllActiveCategories failed", e);
            throw new RuntimeException("Failed to list categories: " + e.getMessage(), e);
        }
    }
    
    /**
     * Tìm kiếm category theo tên
     */
    @Transactional(readOnly = true)
    public List<Category> searchCategoriesByName(String name) {
        log.info("Searching categories by name: {}", name);
        try {
            return categoryRepository.findByNameContainingIgnoreCase(name);
        } catch (Exception e) {
            log.error("searchCategoriesByName failed, name={}", name, e);
            throw new RuntimeException("Failed to search categories: " + e.getMessage(), e);
        }
    }
    
    /**
     * Lấy danh sách category với phân trang
     */
    @Transactional(readOnly = true)
    public Page<Category> getCategoriesWithPagination(Pageable pageable) {
        log.info("Getting categories with pagination: page={}, size={}", 
                pageable.getPageNumber(), pageable.getPageSize());
        try {
            List<Category> categories = categoryRepository.findAllActive();
            // Manual pagination (MongoDB không hỗ trợ Pageable tốt với custom query)
            int start = (int) pageable.getOffset();
            if (start < 0) start = 0;
            if (start > categories.size()) start = categories.size();
            int end = Math.min((start + pageable.getPageSize()), categories.size());
            List<Category> pagedCategories = categories.subList(start, end);
            return new PageImpl<>(pagedCategories, pageable, categories.size());
        } catch (Exception e) {
            log.error("getCategoriesWithPagination failed, page={}, size={}", pageable.getPageNumber(), pageable.getPageSize(), e);
            throw new RuntimeException("Failed to paginate categories: " + e.getMessage(), e);
        }
    }
    
    /**
     * Đếm số lượng category đang hoạt động
     */
    @Transactional(readOnly = true)
    public long countActiveCategories() {
        try {
            return categoryRepository.countActive();
        } catch (Exception e) {
            log.error("countActiveCategories failed", e);
            throw new RuntimeException("Failed to count categories: " + e.getMessage(), e);
        }
    }
}
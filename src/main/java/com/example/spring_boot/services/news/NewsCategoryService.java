package com.example.spring_boot.services.news;

import com.example.spring_boot.domains.news.NewsCategory;
import com.example.spring_boot.repository.news.NewsCategoryRepository;
import com.example.spring_boot.utils.ValidationUtils;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.List;
import java.util.logging.Logger;

/**
 * Service xử lý logic nghiệp vụ cho NewsCategory
 * Sử dụng ObjectId embed để tối ưu truy vấn
 */
@Service
public class NewsCategoryService {
    private final NewsCategoryRepository categoryRepo;
    private static final Logger logger = Logger.getLogger(NewsCategoryService.class.getName());

    public NewsCategoryService(NewsCategoryRepository categoryRepo) {
        this.categoryRepo = categoryRepo;
    }

    /**
     * Tạo category mới
     */
    public NewsCategory create(NewsCategory input) {
        try {
            if (input == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Category data is required");
            }
            
            String name = ValidationUtils.normalize(input.getName());
            if (name == null || name.trim().isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Category name is required");
            }
            
            if (categoryRepo.existsByName(name)) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "Category name already exists");
            }

            NewsCategory category = NewsCategory.builder()
                    .name(name)
                    .description(ValidationUtils.normalize(input.getDescription()))
                    .createdAt(Instant.now())
                    .build();
            
            NewsCategory savedCategory = categoryRepo.save(category);
            logger.info("News category created successfully: " + savedCategory.getId());
            return savedCategory;
            
        } catch (ResponseStatusException e) {
            logger.warning("News category creation failed: " + e.getReason());
            throw e;
        } catch (Exception e) {
            logger.severe("Unexpected error creating news category: " + e.getMessage());
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to create news category");
        }
    }

    /**
     * Lấy danh sách categories
     */
    public List<NewsCategory> list(String name) {
        try {
            String keyword = ValidationUtils.normalize(name);
            List<NewsCategory> categories = keyword == null ? 
                categoryRepo.findAll() : 
                categoryRepo.findByNameContainingIgnoreCase(keyword);
            
            logger.info("Retrieved " + categories.size() + " news categories");
            return categories;
            
        } catch (Exception e) {
            logger.severe("Error retrieving news categories: " + e.getMessage());
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to retrieve news categories");
        }
    }

    /**
     * Lấy category theo ID
     */
    public NewsCategory get(String id) {
        try {
            if (id == null || id.trim().isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Category ID is required");
            }
            
            NewsCategory category = categoryRepo.findById(id)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "News category not found"));
            
            logger.info("Retrieved news category: " + category.getId());
            return category;
            
        } catch (ResponseStatusException e) {
            logger.warning("News category retrieval failed: " + e.getReason());
            throw e;
        } catch (Exception e) {
            logger.severe("Unexpected error retrieving news category: " + e.getMessage());
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to retrieve news category");
        }
    }

    /**
     * Cập nhật category
     */
    public NewsCategory update(String id, NewsCategory input) {
        try {
            if (input == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Category data is required");
            }
            
            NewsCategory existingCategory = get(id);
            
            String name = ValidationUtils.normalize(input.getName());
            if (name != null && !name.equals(existingCategory.getName())) {
                if (categoryRepo.existsByName(name)) {
                    throw new ResponseStatusException(HttpStatus.CONFLICT, "Category name already exists");
                }
                existingCategory.setName(name);
            }
            
            String description = ValidationUtils.normalize(input.getDescription());
            if (description != null) {
                existingCategory.setDescription(description);
            }
            
            existingCategory.setUpdatedAt(Instant.now());
            NewsCategory updatedCategory = categoryRepo.save(existingCategory);
            
            logger.info("News category updated successfully: " + updatedCategory.getId());
            return updatedCategory;
            
        } catch (ResponseStatusException e) {
            logger.warning("News category update failed: " + e.getReason());
            throw e;
        } catch (Exception e) {
            logger.severe("Unexpected error updating news category: " + e.getMessage());
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to update news category");
        }
    }

    /**
     * Xóa category (soft delete)
     */
    public void delete(String id) {
        try {
            if (id == null || id.trim().isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Category ID is required");
            }
            
            NewsCategory category = get(id);
            category.setDeletedAt(Instant.now());
            categoryRepo.save(category);
            
            logger.info("News category deleted successfully: " + id);
            
        } catch (ResponseStatusException e) {
            logger.warning("News category deletion failed: " + e.getReason());
            throw e;
        } catch (Exception e) {
            logger.severe("Unexpected error deleting news category: " + e.getMessage());
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to delete news category");
        }
    }
}

package com.example.spring_boot.services.news; // Package service quản lý danh mục tin tức

import com.example.spring_boot.domains.news.NewsCategory; // Entity danh mục tin tức
import com.example.spring_boot.repository.news.NewsCategoryRepository; // Repository danh mục
import com.example.spring_boot.utils.ValidationUtils; // Tiện ích normalize
import org.springframework.http.HttpStatus; // Mã trạng thái HTTP
import org.springframework.stereotype.Service; // Bean service Spring
import org.springframework.web.server.ResponseStatusException; // Exception HTTP chuẩn

import java.time.Instant; // Thời điểm UTC
import java.util.List; // Danh sách kết quả
import java.util.logging.Logger; // Logger JDK

/** Service xử lý logic nghiệp vụ cho NewsCategory. */
@Service
public class NewsCategoryService {
    private final NewsCategoryRepository categoryRepo; // DAO danh mục
    private static final Logger logger = Logger.getLogger(NewsCategoryService.class.getName()); // Logger

    public NewsCategoryService(NewsCategoryRepository categoryRepo) {
        this.categoryRepo = categoryRepo; // Inject repo danh mục
    }

    /** Tạo category mới. */
    public NewsCategory create(NewsCategory input) {
        try {
            if (input == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Category data is required"); // Thiếu payload
            }

            String name = ValidationUtils.normalize(input.getName()); // Chuẩn hóa tên
            if (name == null || name.trim().isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Category name is required"); // Bắt buộc tên
            }

            if (categoryRepo.existsByName(name)) { // Trùng tên -> xung đột
                throw new ResponseStatusException(HttpStatus.CONFLICT, "Category name already exists");
            }

            NewsCategory category = NewsCategory.builder()
                    .name(name) // Tên đã chuẩn hóa
                    .description(ValidationUtils.normalize(input.getDescription())) // Mô tả chuẩn hóa
                    .createdAt(Instant.now()) // Thời điểm tạo
                    .build();

            NewsCategory savedCategory = categoryRepo.save(category); // Lưu entity
            logger.info("News category created successfully: " + savedCategory.getId()); // Log thành công
            return savedCategory; // Trả về kết quả

        } catch (ResponseStatusException e) {
            logger.warning("News category creation failed: " + e.getReason()); // Log cảnh báo
            throw e; // Ném lại cho controller
        } catch (Exception e) {
            logger.severe("Unexpected error creating news category: " + e.getMessage()); // Lỗi hệ thống
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to create news category");
        }
    }

    /** Lấy danh sách categories. */
    public List<NewsCategory> list(String name) {
        try {
            String keyword = ValidationUtils.normalize(name); // Chuẩn hóa từ khóa
            List<NewsCategory> categories = keyword == null ? categoryRepo.findAll()
                    : categoryRepo.findByNameContainingIgnoreCase(keyword); // Truy vấn theo tên ignore-case

            logger.info("Retrieved " + categories.size() + " news categories"); // Log số lượng
            return categories; // Trả về danh sách

        } catch (Exception e) {
            logger.severe("Error retrieving news categories: " + e.getMessage()); // Lỗi hệ thống
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to retrieve news categories");
        }
    }

    /** Lấy category theo ID. */
    public NewsCategory get(String id) {
        try {
            if (id == null || id.trim().isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Category ID is required"); // Thiếu id
            }

            NewsCategory category = categoryRepo.findById(id)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "News category not found")); // Không
                                                                                                                      // thayas
                                                                                                                      // ->
                                                                                                                      // 404

            logger.info("Retrieved news category: " + category.getId()); // Log thành công
            return category; // Trả về entity

        } catch (ResponseStatusException e) {
            logger.warning("News category retrieval failed: " + e.getReason()); // Log cảnh báo
            throw e; // Ném lại cho controller
        } catch (Exception e) {
            logger.severe("Unexpected error retrieving news category: " + e.getMessage()); // Lỗi hệ thống
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to retrieve news category");
        }
    }

    /** Cập nhật category. */
    public NewsCategory update(String id, NewsCategory input) {
        try {
            if (input == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Category data is required"); // Thiếu payload
            }

            NewsCategory existingCategory = get(id); // Lấy bản hiện có hoặc 404

            String name = ValidationUtils.normalize(input.getName()); // Chuẩn hóa tên
            if (name != null && !name.equals(existingCategory.getName())) {
                if (categoryRepo.existsByName(name)) { // Trùng tên -> xung đột
                    throw new ResponseStatusException(HttpStatus.CONFLICT, "Category name already exists");
                }
                existingCategory.setName(name); // Cập nhật tên
            }

            String description = ValidationUtils.normalize(input.getDescription()); // Chuẩn hóa mô tả
            if (description != null) {
                existingCategory.setDescription(description); // Cập nhật mô tả
            }

            existingCategory.setUpdatedAt(Instant.now()); // Thời điểm cập nhật
            NewsCategory updatedCategory = categoryRepo.save(existingCategory); // Lưu thay đổi

            logger.info("News category updated successfully: " + updatedCategory.getId()); // Log thành công
            return updatedCategory; // Trả về kết quả

        } catch (ResponseStatusException e) {
            logger.warning("News category update failed: " + e.getReason()); // Log cảnh báo
            throw e; // Ném lại cho controller
        } catch (Exception e) {
            logger.severe("Unexpected error updating news category: " + e.getMessage()); // Lỗi hệ thống
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to update news category");
        }
    }

    /** Xóa category (soft delete). */
    public void delete(String id) {
        try {
            if (id == null || id.trim().isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Category ID is required"); // Thiếu id
            }

            NewsCategory category = get(id); // Lấy bản hiện có
            category.setDeletedAt(Instant.now()); // Đánh dấu xóa mềm
            categoryRepo.save(category); // Lưu thay đổi

            logger.info("News category deleted successfully: " + id); // Log thành công

        } catch (ResponseStatusException e) {
            logger.warning("News category deletion failed: " + e.getReason()); // Log cảnh báo
            throw e; // Ném lại cho controller
        } catch (Exception e) {
            logger.severe("Unexpected error deleting news category: " + e.getMessage()); // Lỗi hệ thống
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to delete news category");
        }
    }
}

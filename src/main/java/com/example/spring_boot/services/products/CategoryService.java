package com.example.spring_boot.services.products; // Package service quản lý danh mục sản phẩm

import com.example.spring_boot.domains.products.Category; // Entity danh mục
import com.example.spring_boot.repository.products.CategoryRepository; // Repository Mongo cho danh mục

import lombok.RequiredArgsConstructor; // Inject constructor cho field final
import lombok.extern.slf4j.Slf4j; // Hỗ trợ logging
import org.springframework.data.domain.Page; // Kết quả phân trang
import org.springframework.data.domain.PageImpl; // Page impl dựa trên danh sách
import org.springframework.data.domain.Pageable; // Đầu vào phân trang
import org.springframework.stereotype.Service; // Bean service Spring
import org.springframework.transaction.annotation.Transactional; // Transaction wrapper

import java.time.Instant; // Thời điểm UTC
import java.util.List; // Danh sách kết quả

@Service // Đăng ký bean service
@RequiredArgsConstructor // Tạo constructor cho field final
@Slf4j // Bật logging
@Transactional // Transaction cho class
public class CategoryService {

    private final CategoryRepository categoryRepository; // DAO danh mục

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

    /** Lấy tất cả category đang hoạt động. */
    @Transactional(readOnly = true)
    public List<Category> getAllActiveCategories() {
        log.info("Getting all active categories"); // Log truy vấn
        try {
            return categoryRepository.findAllActive(); // Query custom chỉ lấy bản ghi chưa xóa mềm
        } catch (Exception e) {
            log.error("getAllActiveCategories failed", e); // Log lỗi
            throw new RuntimeException("Failed to list categories: " + e.getMessage(), e); // Bao lỗi nghiệp vụ
        }
    }

    /** Tìm kiếm category theo tên (ignore-case). */
    @Transactional(readOnly = true)
    public List<Category> searchCategoriesByName(String name) {
        log.info("Searching categories by name: {}", name); // Log truy vấn
        try {
            return categoryRepository.findByNameContainingIgnoreCase(name); // Truy vấn like ignore-case
        } catch (Exception e) {
            log.error("searchCategoriesByName failed, name={}", name, e); // Log lỗi
            throw new RuntimeException("Failed to search categories: " + e.getMessage(), e); // Bao lỗi nghiệp vụ
        }
    }

    /** Phân trang category active (manual pagination). */
    @Transactional(readOnly = true)
    public Page<Category> getCategoriesWithPagination(Pageable pageable) {
        log.info("Getting categories with pagination: page={}, size={}",
                pageable.getPageNumber(), pageable.getPageSize()); // Log truy vấn
        try {
            List<Category> categories = categoryRepository.findAllActive(); // Toàn bộ danh sách active
            // Manual pagination (MongoDB không hỗ trợ Pageable tốt với custom query)
            int start = (int) pageable.getOffset(); // Vị trí bắt đầu
            if (start < 0)
                start = 0; // Ràng buộc dưới
            if (start > categories.size())
                start = categories.size(); // Ràng buộc trên
            int end = Math.min((start + pageable.getPageSize()), categories.size()); // Vị trí kết thúc
            List<Category> pagedCategories = categories.subList(start, end); // Cắt danh sách
            return new PageImpl<>(pagedCategories, pageable, categories.size()); // Trả về Page
        } catch (Exception e) {
            log.error("getCategoriesWithPagination failed, page={}, size={}", pageable.getPageNumber(),
                    pageable.getPageSize(), e); // Log lỗi
            throw new RuntimeException("Failed to paginate categories: " + e.getMessage(), e); // Bao lỗi nghiệp vụ
        }
    }

    /** Đếm số lượng category đang hoạt động. */
    @Transactional(readOnly = true)
    public long countActiveCategories() {
        try {
            return categoryRepository.countActive(); // Query custom chỉ đếm bản ghi chưa xóa mềm
        } catch (Exception e) {
            log.error("countActiveCategories failed", e); // Log lỗi
            throw new RuntimeException("Failed to count categories: " + e.getMessage(), e); // Bao lỗi nghiệp vụ
        }
    }
}
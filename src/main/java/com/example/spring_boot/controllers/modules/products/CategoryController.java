package com.example.spring_boot.controllers.modules.products;

import com.example.spring_boot.domains.products.Category;
import com.example.spring_boot.dto.ApiResponse;
import com.example.spring_boot.dto.PageResponse;
import com.example.spring_boot.services.products.CategoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/** Module API cho Category (quản lý danh mục sản phẩm) */
@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
@Tag(name = "Categories", description = "APIs quản lý danh mục sản phẩm (trả về ApiResponse/PageResponse)")
public class CategoryController {

    private final CategoryService categoryService;

    /**
     * Tạo category mới
     * Test API:
     * - POST /api/categories
     * - Body: {"name":"Electronics","description":"Electronic devices"}
     */
    @PostMapping
    @Operation(summary = "Tạo category mới")
    public ResponseEntity<ApiResponse<Category>> create(@RequestBody Map<String, Object> request) {
        String name = (String) request.get("name");
        String description = (String) request.get("description");
        Category created = categoryService.createCategory(name, description);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(created, "Category created successfully"));
    }

    /**
     * Cập nhật category
     * Test API:
     * - PUT /api/categories/{id}
     * - Body (optional): {"name":"Updated Electronics","description":"Updated description"}
     */
    @PutMapping("/{id}")
    @Operation(summary = "Cập nhật category")
    public ApiResponse<Category> update(@PathVariable String id, @RequestBody Map<String, Object> request) {
        String name = (String) request.get("name");
        String description = (String) request.get("description");
        return ApiResponse.success(categoryService.updateCategory(id, name, description), "Category updated successfully");
    }

    /** DELETE /api/categories/{id} */
    @DeleteMapping("/{id}")
    @Operation(summary = "Xóa category (soft)")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable String id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Category deleted successfully"));
    }

    /**
     * Khôi phục category đã xóa
     * Test API:
     * - POST /api/categories/{id}/restore
     */
    @PostMapping("/{id}/restore")
    @Operation(summary = "Khôi phục category")
    public ApiResponse<Category> restore(@PathVariable String id) {
        return ApiResponse.success(categoryService.restoreCategory(id), "Category restored successfully");
    }

    /** GET /api/categories/{id} */
    @GetMapping("/{id}")
    @Operation(summary = "Chi tiết category")
    public ApiResponse<Category> get(@PathVariable String id) {
        return ApiResponse.success(categoryService.getCategoryById(id), "Category retrieved successfully");
    }

    /** Danh sách categories; GET /api/categories?name=... */
    @GetMapping
    @Operation(summary = "Danh sách categories (PageResponse)")
    public ApiResponse<PageResponse<Category>> list(@RequestParam(value = "name", required = false) String name,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "1000") int size) {
        var items = name != null ? categoryService.searchCategoriesByName(name) : categoryService.getAllActiveCategories();
        return ApiResponse.success(new PageResponse<>(items, items.size(), page, size), "Categories retrieved successfully");
    }

    /** Tìm kiếm categories theo tên; GET /api/categories/search?name=... */
    @GetMapping("/search")
    @Operation(summary = "Tìm kiếm categories theo tên")
    public ApiResponse<List<Category>> search(@RequestParam String name) {
        return ApiResponse.success(categoryService.searchCategoriesByName(name), "Categories search completed successfully");
    }

    /** Phân trang categories; GET /api/categories/paged?page=0&size=10&sortBy=name&sortDir=asc */
    @GetMapping("/paged")
    @Operation(summary = "Phân trang categories")
    public ApiResponse<PageResponse<Category>> paged(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        var res = categoryService.getCategoriesWithPagination(pageable);
        PageResponse<Category> pr = new PageResponse<>(res.getContent(), res.getTotalElements(), res.getNumber(), res.getSize());
        return ApiResponse.success(pr, "Categories pagination completed successfully");
    }

    /** Đếm số categories; GET /api/categories/count */
    @GetMapping("/count")
    @Operation(summary = "Đếm số categories")
    public ApiResponse<Long> count() {
        return ApiResponse.success(categoryService.countActiveCategories(), "Categories count retrieved successfully");
    }
}
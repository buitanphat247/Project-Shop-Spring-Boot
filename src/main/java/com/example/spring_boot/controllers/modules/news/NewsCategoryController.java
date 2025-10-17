package com.example.spring_boot.controllers.modules.news;

import com.example.spring_boot.domains.news.NewsCategory;
import com.example.spring_boot.dto.ApiResponse;
import com.example.spring_boot.services.news.NewsCategoryService;
import com.example.spring_boot.dto.PageResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller cho NewsCategory
 * Endpoints: /api/news-categories
 */
@RestController
@RequestMapping("/api/news-categories")
@Tag(name = "News Category", description = "Quản lý danh mục tin tức")
public class NewsCategoryController {
    private final NewsCategoryService categoryService;

    public NewsCategoryController(NewsCategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @PostMapping
    @Operation(summary = "Tạo danh mục mới", description = "Tạo danh mục tin tức mới với tên và mô tả")
    public ResponseEntity<ApiResponse<NewsCategory>> create(@RequestBody NewsCategory input) {
        NewsCategory category = categoryService.create(input);
        return ResponseEntity.ok(ApiResponse.success(category, "Category created successfully"));
    }

    @GetMapping
    @Operation(summary = "Lấy danh sách danh mục", description = "Lấy danh sách tất cả danh mục, có thể tìm kiếm theo tên")
    public ResponseEntity<ApiResponse<PageResponse<NewsCategory>>> list(
            @Parameter(description = "Từ khóa tìm kiếm theo tên danh mục") @RequestParam(required = false) String name) {
        List<NewsCategory> categories = categoryService.list(name);
        PageResponse<NewsCategory> payload = new PageResponse<>(categories, categories.size(), 0, 1000);
        return ResponseEntity.ok(ApiResponse.success(payload, "Categories retrieved successfully"));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Lấy danh mục theo ID", description = "Lấy thông tin chi tiết danh mục theo ID")
    public ResponseEntity<ApiResponse<NewsCategory>> get(
            @Parameter(description = "ID của danh mục") @PathVariable String id) {
        NewsCategory category = categoryService.get(id);
        return ResponseEntity.ok(ApiResponse.success(category, "Category retrieved successfully"));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Cập nhật danh mục", description = "Cập nhật thông tin danh mục theo ID")
    public ResponseEntity<ApiResponse<NewsCategory>> update(
            @Parameter(description = "ID của danh mục") @PathVariable String id,
            @RequestBody NewsCategory input) {
        NewsCategory category = categoryService.update(id, input);
        return ResponseEntity.ok(ApiResponse.success(category, "Category updated successfully"));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Xóa danh mục", description = "Xóa danh mục theo ID (soft delete)")
    public ResponseEntity<ApiResponse<Void>> delete(
            @Parameter(description = "ID của danh mục") @PathVariable String id) {
        categoryService.delete(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Category deleted successfully"));
    }
}

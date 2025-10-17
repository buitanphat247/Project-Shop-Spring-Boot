package com.example.spring_boot.controllers.modules.products;

import com.example.spring_boot.domains.products.Category;
import com.example.spring_boot.dto.ApiResponse;
import com.example.spring_boot.dto.PageResponse;
import com.example.spring_boot.services.products.CategoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
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

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
@Tag(name = "Category Management", description = "APIs for managing product categories")
public class CategoryController {

    private final CategoryService categoryService;

    /**
     * Create new category
     */
    @PostMapping
    @Operation(summary = "Create new category", description = "Create a new product category")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "Category created successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Bad request - validation failed")
    })
    public ResponseEntity<ApiResponse<Category>> createCategory(@RequestBody Map<String, Object> request) {
        try {
            String name = (String) request.get("name");
            String description = (String) request.get("description");

            log.info("Creating category: {}", name);
            Category createdCategory = categoryService.createCategory(name, description);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success(createdCategory, "Category created successfully"));
        } catch (Exception e) {
            log.error("Error creating category: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.fail(e.getMessage()));
        }
    }

    /**
     * Update category
     */
    @PutMapping("/{id}")
    @Operation(summary = "Update category", description = "Update an existing product category")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Category updated successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Bad request - validation failed"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Category not found")
    })
    public ResponseEntity<ApiResponse<Category>> updateCategory(
            @Parameter(description = "Category ID") @PathVariable String id,
            @RequestBody Map<String, Object> request) {
        try {
            String name = (String) request.get("name");
            String description = (String) request.get("description");

            log.info("Updating category with ID: {}", id);
            Category updatedCategory = categoryService.updateCategory(id, name, description);

            return ResponseEntity.ok(ApiResponse.success(updatedCategory, "Category updated successfully"));
        } catch (Exception e) {
            log.error("Error updating category: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.fail(e.getMessage()));
        }
    }

    /**
     * Soft delete category
     */
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete category", description = "Soft delete a product category")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Category deleted successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Bad request - category not found or already deleted")
    })
    public ResponseEntity<ApiResponse<Void>> deleteCategory(
            @Parameter(description = "Category ID") @PathVariable String id) {
        try {
            log.info("Deleting category with ID: {}", id);
            categoryService.deleteCategory(id);

            return ResponseEntity.ok(ApiResponse.success(null, "Category deleted successfully"));
        } catch (Exception e) {
            log.error("Error deleting category: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.fail(e.getMessage()));
        }
    }

    /**
     * Restore deleted category
     */
    @PostMapping("/{id}/restore")
    @Operation(summary = "Restore category", description = "Restore a soft-deleted product category")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Category restored successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Bad request - category not found or not deleted")
    })
    public ResponseEntity<ApiResponse<Category>> restoreCategory(
            @Parameter(description = "Category ID") @PathVariable String id) {
        try {
            log.info("Restoring category with ID: {}", id);
            Category restoredCategory = categoryService.restoreCategory(id);

            return ResponseEntity.ok(ApiResponse.success(restoredCategory, "Category restored successfully"));
        } catch (Exception e) {
            log.error("Error restoring category: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.fail(e.getMessage()));
        }
    }

    /**
     * Get category by ID
     */
    @GetMapping("/{id}")
    @Operation(summary = "Get category by ID", description = "Retrieve a specific product category by its ID")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Category retrieved successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Category not found")
    })
    public ResponseEntity<ApiResponse<Category>> getCategoryById(
            @Parameter(description = "Category ID") @PathVariable String id) {
        try {
            log.info("Getting category by ID: {}", id);
            Category category = categoryService.getCategoryById(id);

            return ResponseEntity.ok(ApiResponse.ok(category));
        } catch (Exception e) {
            log.error("Error getting category: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.fail(e.getMessage()));
        }
    }

    /**
     * Get all active categories
     */
    @GetMapping
    @Operation(summary = "Get all active categories", description = "Retrieve all active product categories")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Categories retrieved successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<ApiResponse<List<Category>>> getAllActiveCategories() {
        try {
            log.info("Getting all active categories");
            List<Category> categories = categoryService.getAllActiveCategories();

            return ResponseEntity.ok(ApiResponse.ok(categories));
        } catch (Exception e) {
            log.error("Error getting categories: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.fail(e.getMessage()));
        }
    }

    /**
     * Search categories by name
     */
    @GetMapping("/search")
    @Operation(summary = "Search categories by name", description = "Search product categories by name (case-insensitive)")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Categories found successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<ApiResponse<List<Category>>> searchCategoriesByName(
            @Parameter(description = "Category name to search") @RequestParam String name) {
        try {
            log.info("Searching categories by name: {}", name);
            List<Category> categories = categoryService.searchCategoriesByName(name);

            return ResponseEntity.ok(ApiResponse.ok(categories));
        } catch (Exception e) {
            log.error("Error searching categories: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.fail(e.getMessage()));
        }
    }

    /**
     * Get categories with pagination
     */
    @GetMapping("/paged")
    @Operation(summary = "Get categories with pagination", description = "Retrieve product categories with pagination and sorting")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Categories retrieved successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<ApiResponse<PageResponse<Category>>> getCategoriesWithPagination(
            @Parameter(description = "Page number (0-based)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "10") int size,
            @Parameter(description = "Sort by field") @RequestParam(defaultValue = "name") String sortBy,
            @Parameter(description = "Sort direction (asc/desc)") @RequestParam(defaultValue = "asc") String sortDir) {
        try {
            log.info("Getting categories with pagination: page={}, size={}", page, size);

            Sort sort = sortDir.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();

            Pageable pageable = PageRequest.of(page, size, sort);
            var categories = categoryService.getCategoriesWithPagination(pageable);

            PageResponse<Category> pageResponse = new PageResponse<>(
                    categories.getContent(),
                    categories.getTotalElements(),
                    categories.getNumber(),
                    categories.getSize());

            return ResponseEntity.ok(ApiResponse.ok(pageResponse));
        } catch (Exception e) {
            log.error("Error getting paginated categories: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.fail(e.getMessage()));
        }
    }

    /**
     * Count active categories
     */
    @GetMapping("/count")
    @Operation(summary = "Count active categories", description = "Get the total count of active product categories")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Count retrieved successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<ApiResponse<Long>> countActiveCategories() {
        try {
            log.info("Counting active categories");
            long count = categoryService.countActiveCategories();

            return ResponseEntity.ok(ApiResponse.ok(count));
        } catch (Exception e) {
            log.error("Error counting categories: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.fail(e.getMessage()));
        }
    }
}
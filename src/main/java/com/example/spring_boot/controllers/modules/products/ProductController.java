package com.example.spring_boot.controllers.modules.products;

import com.example.spring_boot.domains.products.Product;
import com.example.spring_boot.dto.ApiResponse;
import com.example.spring_boot.dto.PageResponse;
import com.example.spring_boot.services.products.ProductService;
import com.example.spring_boot.services.products.ProductImageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.stream.Collectors;

/** Module API cho Product (embed category) */
@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Products", description = "APIs quản lý sản phẩm (trả về ApiResponse/PageResponse)")
public class ProductController {

    private final ProductService productService;
    private final ProductImageService productImageService;

    /**
     * Tạo product mới (embed category)
     * Test API:
     * - POST /api/products
     * - Body: {"name":"iPhone
     * 15","price":999.99,"stock":50,"categoryId":"CATEGORY_ID"}
     */
    @PostMapping
    @Operation(summary = "Tạo product mới")
    public ResponseEntity<ApiResponse<Product>> create(@RequestBody Product product) {
        Product created = productService.create(product);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(created, "Product created successfully"));
    }

    /**
     * Cập nhật product
     * Test API:
     * - PUT /api/products/{id}
     * - Body (optional): {"name":"iPhone 15 Pro","price":1099.99,"stock":30}
     */
    @PutMapping("/{id}")
    @Operation(summary = "Cập nhật product")
    public ApiResponse<Product> update(@PathVariable String id, @RequestBody Product product) {
        return ApiResponse.success(productService.update(id, product), "Product updated successfully");
    }

    /** DELETE /api/products/{id} */
    @DeleteMapping("/{id}")
    @Operation(summary = "Xóa product (soft)")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable String id) {
        productService.softDelete(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Product deleted successfully"));
    }

    /** GET /api/products/{id} */
    @GetMapping("/{id}")
    @Operation(summary = "Chi tiết product")
    public ApiResponse<Product> get(@PathVariable String id) {
        return ApiResponse.success(productService.getById(id), "Product retrieved successfully");
    }

    /** GET /api/products/detail/{id} - Chi tiết sản phẩm với hình ảnh */
    @GetMapping("/detail/{id}")
    @Operation(summary = "Chi tiết sản phẩm với hình ảnh")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getProductDetail(@PathVariable String id) {
        Product product = productService.getById(id);
        if (product == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.fail("Sản phẩm không tồn tại"));
        }

        // Lấy hình ảnh của sản phẩm
        List<Map<String, Object>> images = productImageService.getByProductId(id).stream()
                .map(image -> {
                    Map<String, Object> imageMap = new HashMap<>();
                    imageMap.put("id", image.getId());
                    imageMap.put("imageUrl", image.getImageUrl());
                    imageMap.put("isPrimary", image.getIsPrimary());
                    imageMap.put("createdAt", image.getCreatedAt());
                    return imageMap;
                })
                .collect(Collectors.toList());

        // Merge sản phẩm và hình ảnh
        Map<String, Object> productWithImages = new HashMap<>();
        productWithImages.put("id", product.getId());
        productWithImages.put("name", product.getName());
        productWithImages.put("description", product.getDescription());
        productWithImages.put("price", product.getPrice());
        productWithImages.put("stock", product.getStock());
        productWithImages.put("category", product.getCategory());
        productWithImages.put("createdAt", product.getCreatedAt());
        productWithImages.put("updatedAt", product.getUpdatedAt());
        productWithImages.put("deletedAt", product.getDeletedAt());
        productWithImages.put("images", images);

        return ResponseEntity.ok(ApiResponse.success(productWithImages, "Chi tiết sản phẩm được lấy thành công"));
    }

    @GetMapping
    @Operation(summary = "Danh sách products (PageResponse)")
    public ApiResponse<PageResponse<Product>> list(
            @RequestParam(value = "name", required = false) String name,
            @RequestParam(value = "categoryId", required = false) String categoryId,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "1") int size) {

        PageResponse<Product> response;
        if (categoryId != null) {
            List<Product> items = productService.getByCategoryId(categoryId);
            response = new PageResponse<>(items, items.size(), page, size);
        } else if (name != null) {
            List<Product> items = productService.searchByName(name);
            response = new PageResponse<>(items, items.size(), page, size);
        } else {
            Pageable pageable = PageRequest.of(page, size);
            Page<Product> pageResult = productService.getPaged(pageable);
            response = new PageResponse<>(pageResult.getContent(), pageResult.getTotalElements(), page, size);
        }
        return ApiResponse.success(response, "Products retrieved successfully");
    }

    /** Tìm kiếm products theo tên; GET /api/products/search?name=... */
    @GetMapping("/search")
    @Operation(summary = "Tìm kiếm products theo tên")
    public ApiResponse<List<Product>> search(@RequestParam String name) {
        return ApiResponse.success(productService.searchByName(name), "Products search completed successfully");
    }

    /**
     * Phân trang products; GET
     * /api/products/paged?page=0&size=10&sortBy=name&sortDir=asc
     */
    @GetMapping("/paged")
    @Operation(summary = "Phân trang products")
    public ApiResponse<PageResponse<Product>> paged(
            @RequestParam(value = "name", required = false) String name,
            @RequestParam(value = "categoryId", required = false) String categoryId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {

        // Sort sort = sortDir.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size);
        Page<Product> pageResult = productService.getPaged(pageable);
        PageResponse<Product> response = new PageResponse<>(pageResult.getContent(), pageResult.getTotalElements(),
                page, size);
        return ApiResponse.success(response, "Products pagination completed successfully");
    }
}

package com.example.spring_boot.controllers.modules.products;

import com.example.spring_boot.domains.products.Product;
import com.example.spring_boot.dto.ApiResponse;
import com.example.spring_boot.dto.PageResponse;
import com.example.spring_boot.services.products.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Products", description = "Product management APIs")
public class ProductController {

    private final ProductService productService;

    @PostMapping
    @Operation(summary = "Create product")
    public ResponseEntity<ApiResponse<Product>> create(@RequestBody Product product) {
        Product created = productService.create(product);
        return ResponseEntity.ok(ApiResponse.success(created, "Product created successfully"));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update product")
    public ResponseEntity<ApiResponse<Product>> update(
            @PathVariable String id,
            @RequestBody Product product) {
        Product updated = productService.update(id, product);
        return ResponseEntity.ok(ApiResponse.success(updated, "Product updated successfully"));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete product (soft)")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable String id) {
        productService.softDelete(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Product deleted successfully"));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get product by ID")
    public ResponseEntity<ApiResponse<Product>> getById(@PathVariable String id) {
        Product p = productService.getById(id);
        return ResponseEntity.ok(ApiResponse.ok(p));
    }

    @GetMapping
    @Operation(summary = "Get all products")
    public ResponseEntity<ApiResponse<List<Product>>> getAll() {
        return ResponseEntity.ok(ApiResponse.ok(productService.getAllActive()));
    }

    @GetMapping("/search")
    @Operation(summary = "Search products by name")
    public ResponseEntity<ApiResponse<List<Product>>> search(@RequestParam String name) {
        return ResponseEntity.ok(ApiResponse.ok(productService.searchByName(name)));
    }

    @GetMapping("/paged")
    @Operation(summary = "Get products with pagination")
    public ResponseEntity<ApiResponse<PageResponse<Product>>> paged(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        var res = productService.getPaged(pageable);
        PageResponse<Product> pr = new PageResponse<>(res.getContent(), res.getTotalElements(), res.getNumber(),
                res.getSize());
        return ResponseEntity.ok(ApiResponse.ok(pr));
    }
}

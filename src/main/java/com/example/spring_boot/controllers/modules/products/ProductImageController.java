package com.example.spring_boot.controllers.modules.products;

import com.example.spring_boot.domains.products.ProductImage;
import com.example.spring_boot.dto.ApiResponse;
import com.example.spring_boot.services.products.ProductImageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/product-images")
@RequiredArgsConstructor
@Tag(name = "Product Images", description = "APIs for managing product images")
public class ProductImageController {

    private final ProductImageService productImageService;

    @PostMapping
    @Operation(summary = "Create product image")
    public ResponseEntity<ApiResponse<ProductImage>> create(@RequestBody ProductImage img) {
        ProductImage created = productImageService.create(img);
        return ResponseEntity.ok(ApiResponse.success(created, "Product image created successfully"));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete product image (soft)")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable String id) {
        productImageService.softDelete(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Product image deleted successfully"));
    }

    @GetMapping("/by-product/{productId}")
    @Operation(summary = "Get images by product ID")
    public ResponseEntity<ApiResponse<List<ProductImage>>> getByProduct(@PathVariable String productId) {
        return ResponseEntity.ok(ApiResponse.ok(productImageService.getByProductId(productId)));
    }
}

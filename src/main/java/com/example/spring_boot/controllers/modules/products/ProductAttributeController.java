package com.example.spring_boot.controllers.modules.products;

import com.example.spring_boot.domains.products.ProductAttribute;
import com.example.spring_boot.dto.ApiResponse;
import com.example.spring_boot.services.products.ProductAttributeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/product-attributes")
@RequiredArgsConstructor
@Tag(name = "Product Attributes", description = "APIs for managing product attributes")
public class ProductAttributeController {

    private final ProductAttributeService productAttributeService;

    @PostMapping
    @Operation(summary = "Create product attribute")
    public ResponseEntity<ApiResponse<ProductAttribute>> create(@RequestBody ProductAttribute attr) {
        ProductAttribute created = productAttributeService.create(attr);
        return ResponseEntity.ok(ApiResponse.success(created, "Product attribute created successfully"));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete product attribute (soft)")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable String id) {
        productAttributeService.softDelete(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Product attribute deleted successfully"));
    }

    @GetMapping("/by-product/{productId}")
    @Operation(summary = "Get attributes by product ID")
    public ResponseEntity<ApiResponse<List<ProductAttribute>>> getByProduct(@PathVariable String productId) {
        return ResponseEntity.ok(ApiResponse.ok(productAttributeService.getByProductId(productId)));
    }
}

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

/** Module API cho ProductAttribute (quản lý thuộc tính sản phẩm) */
@RestController
@RequestMapping("/api/product-attributes")
@RequiredArgsConstructor
@Tag(name = "Product Attributes", description = "APIs quản lý thuộc tính sản phẩm (trả về ApiResponse)")
public class ProductAttributeController {

    private final ProductAttributeService productAttributeService;

    /**
     * Tạo thuộc tính sản phẩm
     * Test API:
     * - POST /api/product-attributes
     * - Body: {"productId":"PRODUCT_ID","name":"Color","value":"Red"}
     */
    @PostMapping
    @Operation(summary = "Tạo thuộc tính sản phẩm")
    public ResponseEntity<ApiResponse<ProductAttribute>> create(@RequestBody ProductAttribute attr) {
        ProductAttribute created = productAttributeService.create(attr);
        return ResponseEntity.ok(ApiResponse.success(created, "Product attribute created successfully"));
    }

    /** DELETE /api/product-attributes/{id} */
    @DeleteMapping("/{id}")
    @Operation(summary = "Xóa thuộc tính sản phẩm (soft)")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable String id) {
        productAttributeService.softDelete(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Product attribute deleted successfully"));
    }

    /** GET /api/product-attributes/by-product/{productId} */
    @GetMapping("/by-product/{productId}")
    @Operation(summary = "Lấy thuộc tính theo product ID")
    public ApiResponse<List<ProductAttribute>> getByProduct(@PathVariable String productId) {
        return ApiResponse.success(productAttributeService.getByProductId(productId), "Product attributes retrieved successfully");
    }
}

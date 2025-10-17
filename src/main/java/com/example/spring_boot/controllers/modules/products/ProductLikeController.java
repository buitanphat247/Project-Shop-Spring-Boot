package com.example.spring_boot.controllers.modules.products;

import com.example.spring_boot.domains.products.ProductLike;
import com.example.spring_boot.dto.ApiResponse;
import com.example.spring_boot.services.products.ProductLikeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** Module API cho ProductLike (quản lý like sản phẩm) */
@RestController
@RequestMapping("/api/product-likes")
@RequiredArgsConstructor
@Tag(name = "Product Likes", description = "APIs quản lý like sản phẩm (trả về ApiResponse)")
public class ProductLikeController {

    private final ProductLikeService productLikeService;

    /**
     * Like sản phẩm
     * Test API:
     * - POST /api/product-likes
     * - Body: {"productId":"PRODUCT_ID","userId":"USER_ID"}
     */
    @PostMapping
    @Operation(summary = "Like sản phẩm")
    public ResponseEntity<ApiResponse<ProductLike>> like(@RequestBody LikeRequest req) {
        ProductLike created = productLikeService.like(req.productId, req.userId);
        return ResponseEntity.ok(ApiResponse.success(created, "Product liked successfully"));
    }

    /** DELETE /api/product-likes/{likeId} */
    @DeleteMapping("/{likeId}")
    @Operation(summary = "Unlike sản phẩm (soft)")
    public ResponseEntity<ApiResponse<Void>> unlike(@PathVariable String likeId) {
        productLikeService.unlike(likeId);
        return ResponseEntity.ok(ApiResponse.success(null, "Product like deleted successfully"));
    }

    /** GET /api/product-likes/by-product/{productId} */
    @GetMapping("/by-product/{productId}")
    @Operation(summary = "Lấy likes theo product ID")
    public ApiResponse<List<ProductLike>> getByProduct(@PathVariable String productId) {
        return ApiResponse.success(productLikeService.getByProductId(productId), "Product likes retrieved successfully");
    }

    public static class LikeRequest {
        public String productId;
        public String userId;
    }
}



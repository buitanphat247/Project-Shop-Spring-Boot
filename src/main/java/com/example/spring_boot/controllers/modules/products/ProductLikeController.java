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

@RestController
@RequestMapping("/api/product-likes")
@RequiredArgsConstructor
@Tag(name = "Product Likes", description = "APIs for managing product likes")
public class ProductLikeController {

    private final ProductLikeService productLikeService;

    @PostMapping
    @Operation(summary = "Like a product")
    public ResponseEntity<ApiResponse<ProductLike>> like(@RequestBody LikeRequest req) {
        ProductLike created = productLikeService.like(req.productId, req.userId);
        return ResponseEntity.ok(ApiResponse.success(created, "Product liked successfully"));
    }

    @DeleteMapping("/{likeId}")
    @Operation(summary = "Unlike a product (soft)")
    public ResponseEntity<ApiResponse<Void>> unlike(@PathVariable String likeId) {
        productLikeService.unlike(likeId);
        return ResponseEntity.ok(ApiResponse.success(null, "Product like deleted successfully"));
    }

    @GetMapping("/by-product/{productId}")
    @Operation(summary = "Get likes by product ID")
    public ResponseEntity<ApiResponse<List<ProductLike>>> getByProduct(@PathVariable String productId) {
        return ResponseEntity.ok(ApiResponse.ok(productLikeService.getByProductId(productId)));
    }

    public static class LikeRequest {
        public String productId;
        public String userId;
    }
}



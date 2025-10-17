package com.example.spring_boot.services.products;

import com.example.spring_boot.domains.products.ProductLike;
import com.example.spring_boot.repository.products.ProductLikeRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class ProductLikeService {

    private final ProductLikeRepository productLikeRepository;

    /** Like sản phẩm: tránh duplicate theo (productId, userId). */
    public ProductLike like(String productId, String userId) {
        try {
            long exists = productLikeRepository.countByProductIdAndUserId(new ObjectId(productId), new ObjectId(userId));
            if (exists > 0) throw new RuntimeException("User already liked this product");
            ProductLike like = ProductLike.builder()
                    .productId(new ObjectId(productId))
                    .userId(new ObjectId(userId))
                    .createdAt(Instant.now())
                    .build();
            return productLikeRepository.save(like);
        } catch (Exception e) {
            log.error("Like product failed, productId={}, userId={}", productId, userId, e);
            throw new RuntimeException("Failed to like product: " + e.getMessage(), e);
        }
    }

    public void unlike(String likeId) {
        try {
            ProductLike like = productLikeRepository.findById(likeId)
                    .orElseThrow(() -> new RuntimeException("Product like not found with ID: " + likeId));
            if (like.getDeletedAt() != null) throw new RuntimeException("Product like has been deleted");
            like.setDeletedAt(Instant.now());
            productLikeRepository.save(like);
        } catch (Exception e) {
            log.error("Unlike product failed, likeId={}", likeId, e);
            throw new RuntimeException("Failed to unlike product: " + e.getMessage(), e);
        }
    }

    @Transactional(readOnly = true)
    public List<ProductLike> getByProductId(String productId) {
        try {
            return productLikeRepository.findActiveByProductId(new ObjectId(productId));
        } catch (Exception e) {
            log.error("Get likes by product failed, productId={}", productId, e);
            throw new RuntimeException("Failed to get product likes: " + e.getMessage(), e);
        }
    }
}



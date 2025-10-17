package com.example.spring_boot.services.products;

import com.example.spring_boot.domains.products.ProductImage;
import com.example.spring_boot.repository.products.ProductImageRepository;

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
public class ProductImageService {

    private final ProductImageRepository productImageRepository;

    /** Tạo image cho product. */
    public ProductImage create(ProductImage image) {
        try {
            image.setId(null);
            image.setCreatedAt(Instant.now());
            return productImageRepository.save(image);
        } catch (Exception e) {
            log.error("Create product image failed, productId={}", image != null ? image.getProductId() : null, e);
            throw new RuntimeException("Failed to create product image: " + e.getMessage(), e);
        }
    }

    public void softDelete(String id) {
        try {
            ProductImage img = productImageRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Product image not found with ID: " + id));
            if (img.getDeletedAt() != null) throw new RuntimeException("Product image has been deleted");
            img.setDeletedAt(Instant.now());
            productImageRepository.save(img);
        } catch (Exception e) {
            log.error("Soft delete product image failed, id={}", id, e);
            throw new RuntimeException("Failed to soft delete product image: " + e.getMessage(), e);
        }
    }

    @Transactional(readOnly = true)
    public List<ProductImage> getByProductId(String productId) {
        try {
            return productImageRepository.findActiveByProductId(new ObjectId(productId));
        } catch (Exception e) {
            log.error("Get images by product failed, productId={}", productId, e);
            throw new RuntimeException("Failed to get product images: " + e.getMessage(), e);
        }
    }
}



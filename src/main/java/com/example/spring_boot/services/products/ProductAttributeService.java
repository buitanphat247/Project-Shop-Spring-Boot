package com.example.spring_boot.services.products;

import com.example.spring_boot.domains.products.ProductAttribute;
import com.example.spring_boot.repository.products.ProductAttributeRepository;

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
public class ProductAttributeService {

    private final ProductAttributeRepository productAttributeRepository;

    /** Tạo attribute mới cho product. */
    public ProductAttribute create(ProductAttribute attr) {
        try {
            attr.setId(null);
            attr.setCreatedAt(Instant.now());
            return productAttributeRepository.save(attr);
        } catch (Exception e) {
            log.error("Create product attribute failed, productId={}", attr != null ? attr.getProductId() : null, e);
            throw new RuntimeException("Failed to create product attribute: " + e.getMessage(), e);
        }
    }

    public void softDelete(String id) {
        try {
            ProductAttribute attr = productAttributeRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Product attribute not found with ID: " + id));
            if (attr.getDeletedAt() != null) throw new RuntimeException("Product attribute has been deleted");
            attr.setDeletedAt(Instant.now());
            productAttributeRepository.save(attr);
        } catch (Exception e) {
            log.error("Soft delete product attribute failed, id={}", id, e);
            throw new RuntimeException("Failed to soft delete product attribute: " + e.getMessage(), e);
        }
    }

    @Transactional(readOnly = true)
    public List<ProductAttribute> getByProductId(String productId) {
        try {
            return productAttributeRepository.findActiveByProductId(new ObjectId(productId));
        } catch (Exception e) {
            log.error("Get attributes by product failed, productId={}", productId, e);
            throw new RuntimeException("Failed to get product attributes: " + e.getMessage(), e);
        }
    }
}



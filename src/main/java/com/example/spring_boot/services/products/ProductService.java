package com.example.spring_boot.services.products;

import com.example.spring_boot.domains.products.Product;
import com.example.spring_boot.repository.products.ProductRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class ProductService {

    private final ProductRepository productRepository;

    /**
     * Tạo product mới: reset id, set createdAt, lưu DB.
     * Bắt mọi lỗi và log ngữ cảnh để dễ truy vết.
     */
    public Product create(Product product) {
        try {
            product.setId(null);
            product.setCreatedAt(Instant.now());
            return productRepository.save(product);
        } catch (Exception e) {
            log.error("Create product failed, name={}", product != null ? product.getName() : null, e);
            throw new RuntimeException("Failed to create product: " + e.getMessage(), e);
        }
    }

    /**
     * Cập nhật product (chặn nếu đã bị xóa mềm).
     */
    public Product update(String id, Product updated) {
        try {
            Product existing = productRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Product not found with ID: " + id));
            if (existing.getDeletedAt() != null) throw new RuntimeException("Product has been deleted");
            existing.setName(updated.getName());
            existing.setDescription(updated.getDescription());
            existing.setPrice(updated.getPrice());
            existing.setStock(updated.getStock());
            existing.setCategoryId(updated.getCategoryId());
            existing.setUpdatedAt(Instant.now());
            return productRepository.save(existing);
        } catch (Exception e) {
            log.error("Update product failed, id={}", id, e);
            throw new RuntimeException("Failed to update product: " + e.getMessage(), e);
        }
    }

    /** Xóa mềm product. */
    public void softDelete(String id) {
        try {
            Product existing = productRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Product not found with ID: " + id));
            if (existing.getDeletedAt() != null) throw new RuntimeException("Product has been deleted");
            existing.setDeletedAt(Instant.now());
            productRepository.save(existing);
        } catch (Exception e) {
            log.error("Soft delete product failed, id={}", id, e);
            throw new RuntimeException("Failed to soft delete product: " + e.getMessage(), e);
        }
    }

    @Transactional(readOnly = true)
    public Product getById(String id) {
        try {
            Product p = productRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Product not found with ID: " + id));
            if (p.getDeletedAt() != null) throw new RuntimeException("Product has been deleted");
            return p;
        } catch (Exception e) {
            log.error("Get product by id failed, id={}", id, e);
            throw new RuntimeException("Failed to get product: " + e.getMessage(), e);
        }
    }

    @Transactional(readOnly = true)
    public List<Product> getAllActive() {
        try {
            return productRepository.findAllActive();
        } catch (Exception e) {
            log.error("Get all active products failed", e);
            throw new RuntimeException("Failed to list products: " + e.getMessage(), e);
        }
    }

    @Transactional(readOnly = true)
    public List<Product> searchByName(String name) {
        try {
            return productRepository.findByNameContainingIgnoreCase(name);
        } catch (Exception e) {
            log.error("Search products failed, name={}", name, e);
            throw new RuntimeException("Failed to search products: " + e.getMessage(), e);
        }
    }

    @Transactional(readOnly = true)
    public Page<Product> getPaged(Pageable pageable) {
        try {
            List<Product> all = productRepository.findAllActive();
            int start = (int) pageable.getOffset();
            if (start < 0) start = 0;
            if (start > all.size()) start = all.size();
            int end = Math.min(start + pageable.getPageSize(), all.size());
            List<Product> sliced = all.subList(start, end);
            return new PageImpl<>(sliced, pageable, all.size());
        } catch (Exception e) {
            log.error("Get paged products failed, page={}, size={}", pageable.getPageNumber(), pageable.getPageSize(), e);
            throw new RuntimeException("Failed to paginate products: " + e.getMessage(), e);
        }
    }
}



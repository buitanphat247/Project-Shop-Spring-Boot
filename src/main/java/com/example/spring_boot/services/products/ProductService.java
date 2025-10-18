package com.example.spring_boot.services.products; // Package service quản lý sản phẩm

import com.example.spring_boot.domains.products.Product; // Entity sản phẩm
import com.example.spring_boot.repository.products.ProductRepository; // Repository Mongo cho sản phẩm
import com.example.spring_boot.repository.products.CategoryRepository; // Repository danh mục

import lombok.RequiredArgsConstructor; // Inject constructor cho field final
import lombok.extern.slf4j.Slf4j; // Hỗ trợ logging
import org.springframework.data.domain.Page; // Kết quả phân trang
import org.springframework.data.domain.PageImpl; // Triển khai Page từ danh sách
import org.springframework.data.domain.Pageable; // Đầu vào phân trang
import org.springframework.stereotype.Service; // Bean service Spring
import org.springframework.transaction.annotation.Transactional; // Transaction wrapper

import java.time.Instant; // Thời điểm UTC
import java.util.List; // Danh sách kết quả

@Service // Đăng ký bean service
@RequiredArgsConstructor // Tạo constructor cho field final
@Slf4j // Bật logging
@Transactional // Transaction cho class
public class ProductService {

    private final ProductRepository productRepository; // DAO sản phẩm
    private final CategoryRepository categoryRepository; // DAO danh mục

    /** Tạo product mới: reset id, set createdAt, lưu DB. */
    public Product create(Product product) {
        try {
            // Validate categoryId tồn tại
            if (product.getCategoryId() == null) {
                throw new RuntimeException("Category ID is required");
            }
            if (!categoryRepository.existsById(product.getCategoryId().toHexString())) {
                throw new RuntimeException("Category not found");
            }

            product.setId(null); // Reset id để luôn tạo mới
            product.setCreatedAt(Instant.now()); // Gán thời điểm tạo
            Product savedProduct = productRepository.save(product); // Lưu và nhận entity đã lưu

            // Populate category nếu DocumentReference không tự động load
            if (savedProduct.getCategory() == null && savedProduct.getCategoryId() != null) {
                categoryRepository.findById(savedProduct.getCategoryId().toHexString())
                        .ifPresent(savedProduct::setCategory);
            }

            return savedProduct; // Trả về entity đã lưu
        } catch (Exception e) {
            log.error("Create product failed, name={}", product != null ? product.getName() : null, e); // Log ngữ cảnh
            throw new RuntimeException("Failed to create product: " + e.getMessage(), e); // Bao lỗi nghiệp vụ
        }
    }

    /** Cập nhật product (chặn nếu đã bị xóa mềm). */
    public Product update(String id, Product updated) {
        try {
            Product existing = productRepository.findById(id) // Tìm theo id
                    .orElseThrow(() -> new RuntimeException("Product not found with ID: " + id)); // Không thấy -> 404
            if (existing.getDeletedAt() != null)
                throw new RuntimeException("Product has been deleted"); // Đã xóa mềm -> chặn cập nhật

            // Validate categoryId nếu có thay đổi
            if (updated.getCategoryId() != null && !updated.getCategoryId().equals(existing.getCategoryId())) {
                if (!categoryRepository.existsById(updated.getCategoryId().toHexString())) {
                    throw new RuntimeException("Category not found");
                }
                existing.setCategoryId(updated.getCategoryId()); // Cập nhật danh mục
            }

            existing.setName(updated.getName()); // Cập nhật tên
            existing.setDescription(updated.getDescription()); // Cập nhật mô tả
            existing.setPrice(updated.getPrice()); // Cập nhật giá
            existing.setStock(updated.getStock()); // Cập nhật tồn
            existing.setUpdatedAt(Instant.now()); // Gán thời điểm cập nhật

            Product savedProduct = productRepository.save(existing); // Lưu thay đổi

            // Populate category nếu DocumentReference không tự động load
            if (savedProduct.getCategory() == null && savedProduct.getCategoryId() != null) {
                categoryRepository.findById(savedProduct.getCategoryId().toHexString())
                        .ifPresent(savedProduct::setCategory);
            }

            return savedProduct; // Trả về kết quả
        } catch (Exception e) {
            log.error("Update product failed, id={}", id, e); // Log ngữ cảnh
            throw new RuntimeException("Failed to update product: " + e.getMessage(), e); // Bao lỗi nghiệp vụ
        }
    }

    /** Xóa mềm product. */
    public void softDelete(String id) {
        try {
            Product existing = productRepository.findById(id) // Tìm theo id
                    .orElseThrow(() -> new RuntimeException("Product not found with ID: " + id)); // Không thấy -> lỗi
            if (existing.getDeletedAt() != null)
                throw new RuntimeException("Product has been deleted"); // Đã xóa mềm -> chặn thao tác lặp
            existing.setDeletedAt(Instant.now()); // Đánh dấu xóa mềm
            productRepository.save(existing); // Lưu thay đổi
        } catch (Exception e) {
            log.error("Soft delete product failed, id={}", id, e); // Log ngữ cảnh lỗi
            throw new RuntimeException("Failed to soft delete product: " + e.getMessage(), e); // Bao lỗi nghiệp vụ
        }
    }

    @Transactional(readOnly = true)
    /** Lấy product theo id (chỉ trả về nếu chưa bị xóa mềm). */
    public Product getById(String id) {
        try {
            Product p = productRepository.findById(id) // Tìm theo id
                    .orElseThrow(() -> new RuntimeException("Product not found with ID: " + id)); // Không thấy -> 404
            if (p.getDeletedAt() != null)
                throw new RuntimeException("Product has been deleted"); // Đã xóa mềm -> không trả về

            // Populate category nếu DocumentReference không tự động load
            if (p.getCategory() == null && p.getCategoryId() != null) {
                categoryRepository.findById(p.getCategoryId().toHexString())
                        .ifPresent(p::setCategory);
            }

            return p; // Trả về entity
        } catch (Exception e) {
            log.error("Get product by id failed, id={}", id, e); // Log lỗi
            throw new RuntimeException("Failed to get product: " + e.getMessage(), e); // Bao lỗi nghiệp vụ
        }
    }

    @Transactional(readOnly = true)
    /** Lấy toàn bộ sản phẩm đang hoạt động. */
    public List<Product> getAllActive() {
        try {
            List<Product> products = productRepository.findAllActive(); // Query custom trả về các bản ghi chưa xóa mềm

            // Populate category cho từng product
            products.forEach(product -> {
                if (product.getCategory() == null && product.getCategoryId() != null) {
                    categoryRepository.findById(product.getCategoryId().toHexString())
                            .ifPresent(product::setCategory);
                }
            });

            return products; // Trả về danh sách đã populate
        } catch (Exception e) {
            log.error("Get all active products failed", e); // Log lỗi
            throw new RuntimeException("Failed to list products: " + e.getMessage(), e); // Bao lỗi nghiệp vụ
        }
    }

    @Transactional(readOnly = true)
    /** Tìm kiếm theo tên (ignore-case). */
    public List<Product> searchByName(String name) {
        try {
            List<Product> products = productRepository.findByNameContainingIgnoreCase(name); // Truy vấn like
                                                                                             // ignore-case

            // Populate category cho từng product
            products.forEach(product -> {
                if (product.getCategory() == null && product.getCategoryId() != null) {
                    categoryRepository.findById(product.getCategoryId().toHexString())
                            .ifPresent(product::setCategory);
                }
            });

            return products; // Trả về danh sách đã populate
        } catch (Exception e) {
            log.error("Search products failed, name={}", name, e); // Log lỗi
            throw new RuntimeException("Failed to search products: " + e.getMessage(), e); // Bao lỗi nghiệp vụ
        }
    }

    @Transactional(readOnly = true)
    /** Lấy sản phẩm theo categoryId (chỉ trả về sản phẩm chưa bị xóa mềm). */
    public List<Product> getByCategoryId(String categoryId) {
        try {
            List<Product> products = productRepository.findByCategoryIdAndDeletedAtIsNull(categoryId);

            // Populate category cho từng product
            products.forEach(product -> {
                if (product.getCategory() == null && product.getCategoryId() != null) {
                    categoryRepository.findById(product.getCategoryId().toHexString())
                            .ifPresent(product::setCategory);
                }
            });

            return products; // Trả về danh sách đã populate
        } catch (Exception e) {
            log.error("Get products by categoryId failed, categoryId={}", categoryId, e); // Log lỗi
            throw new RuntimeException("Failed to get products by category: " + e.getMessage(), e); // Bao lỗi nghiệp vụ
        }
    }

    @Transactional(readOnly = true)
    /** Phân trang sản phẩm active (manual pagination). */
    public Page<Product> getPaged(Pageable pageable) {
        try {
            List<Product> all = productRepository.findAllActive(); // Toàn bộ danh sách active

            // Populate category cho từng product
            all.forEach(product -> {
                if (product.getCategory() == null && product.getCategoryId() != null) {
                    categoryRepository.findById(product.getCategoryId().toHexString())
                            .ifPresent(product::setCategory);
                }
            });

            int start = (int) pageable.getOffset(); // Vị trí bắt đầu
            if (start < 0)
                start = 0; // Ràng buộc dưới
            if (start > all.size())
                start = all.size(); // Ràng buộc trên
            int end = Math.min(start + pageable.getPageSize(), all.size()); // Vị trí kết thúc
            List<Product> sliced = all.subList(start, end); // Cắt danh sách
            return new PageImpl<>(sliced, pageable, all.size()); // Trả về Page
        } catch (Exception e) {
            log.error("Get paged products failed, page={}, size={}", pageable.getPageNumber(), pageable.getPageSize(),
                    e); // Log lỗi
            throw new RuntimeException("Failed to paginate products: " + e.getMessage(), e); // Bao lỗi nghiệp vụ
        }
    }
}

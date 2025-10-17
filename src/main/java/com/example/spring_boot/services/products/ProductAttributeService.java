package com.example.spring_boot.services.products; // Package service quản lý thuộc tính sản phẩm

import com.example.spring_boot.domains.products.ProductAttribute; // Entity thuộc tính sản phẩm
import com.example.spring_boot.repository.products.ProductAttributeRepository; // Repository Mongo cho thuộc tính

import lombok.RequiredArgsConstructor; // Inject constructor cho field final
import lombok.extern.slf4j.Slf4j; // Hỗ trợ logging
import org.bson.types.ObjectId; // ObjectId MongoDB
import org.springframework.stereotype.Service; // Bean service Spring
import org.springframework.transaction.annotation.Transactional; // Transactional wrapper

import java.time.Instant; // Thời điểm UTC
import java.util.List; // Danh sách kết quả

@Service // Đăng ký bean service
@RequiredArgsConstructor // Tạo constructor cho field final
@Slf4j // Bật logging
@Transactional // Transaction cho class
public class ProductAttributeService {

    private final ProductAttributeRepository productAttributeRepository; // DAO thuộc tính sản phẩm

    /** Tạo thuộc tính mới cho sản phẩm. */
    public ProductAttribute create(ProductAttribute attr) {
        try {
            attr.setId(null); // Reset id để đảm bảo tạo mới
            attr.setCreatedAt(Instant.now()); // Gán thời điểm tạo
            return productAttributeRepository.save(attr); // Lưu và trả về entity đã lưu
        } catch (Exception e) {
            log.error("Create product attribute failed, productId={}", attr != null ? attr.getProductId() : null, e); // Log ngữ cảnh
            throw new RuntimeException("Failed to create product attribute: " + e.getMessage(), e); // Bao lỗi nghiệp vụ
        }
    }

    /** Xóa mềm thuộc tính theo id. */
    public void softDelete(String id) {
        try {
            ProductAttribute attr = productAttributeRepository.findById(id) // Tìm attribute theo id
                    .orElseThrow(() -> new RuntimeException("Product attribute not found with ID: " + id)); // Không thấy -> lỗi
            if (attr.getDeletedAt() != null)
                throw new RuntimeException("Product attribute has been deleted"); // Đã xóa mềm -> chặn thao tác lặp
            attr.setDeletedAt(Instant.now()); // Đánh dấu xóa mềm
            productAttributeRepository.save(attr); // Lưu thay đổi
        } catch (Exception e) {
            log.error("Soft delete product attribute failed, id={}", id, e); // Log ngữ cảnh lỗi
            throw new RuntimeException("Failed to soft delete product attribute: " + e.getMessage(), e); // Bao lỗi nghiệp vụ
        }
    }

    @Transactional(readOnly = true)
    /** Lấy danh sách thuộc tính active theo productId. */
    public List<ProductAttribute> getByProductId(String productId) {
        try {
            return productAttributeRepository.findActiveByProductId(new ObjectId(productId)); // Truy vấn theo ObjectId
        } catch (Exception e) {
            log.error("Get attributes by product failed, productId={}", productId, e); // Log lỗi
            throw new RuntimeException("Failed to get product attributes: " + e.getMessage(), e); // Bao lỗi nghiệp vụ
        }
    }
}

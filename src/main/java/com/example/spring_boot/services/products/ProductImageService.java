package com.example.spring_boot.services.products; // Package service quản lý ảnh sản phẩm

import com.example.spring_boot.domains.products.ProductImage; // Entity ảnh sản phẩm
import com.example.spring_boot.repository.products.ProductImageRepository; // Repository Mongo cho ảnh

import lombok.RequiredArgsConstructor; // Inject constructor cho field final
import lombok.extern.slf4j.Slf4j; // Hỗ trợ logging
import org.bson.types.ObjectId; // ObjectId của Mongo
import org.springframework.stereotype.Service; // Bean service Spring
import org.springframework.transaction.annotation.Transactional; // Transactional

import java.time.Instant; // Thời điểm UTC
import java.util.List; // Danh sách kết quả

@Service // Đăng ký bean service
@RequiredArgsConstructor // Tạo constructor
@Slf4j // Bật logging
@Transactional // Bật transaction cho class
public class ProductImageService {

    private final ProductImageRepository productImageRepository; // DAO ảnh sản phẩm

    /** Tạo mới ảnh cho sản phẩm. */
    public ProductImage create(ProductImage image) {
        try {
            image.setId(null); // Reset id để đảm bảo tạo mới
            image.setCreatedAt(Instant.now()); // Gán thời điểm tạo
            return productImageRepository.save(image); // Lưu và trả về entity đã lưu
        } catch (Exception e) {
            log.error("Create product image failed, productId={}", image != null ? image.getProductId() : null, e); // Log ngữ cảnh
            throw new RuntimeException("Failed to create product image: " + e.getMessage(), e); // Bao lỗi nghiệp vụ
        }
    }

    /** Xóa mềm ảnh theo id. */
    public void softDelete(String id) {
        try {
            ProductImage img = productImageRepository.findById(id) // Tìm ảnh theo id
                    .orElseThrow(() -> new RuntimeException("Product image not found with ID: " + id)); // Không thấy -> lỗi
            if (img.getDeletedAt() != null)
                throw new RuntimeException("Product image has been deleted"); // Đã xóa mềm -> chặn thao tác lặp
            img.setDeletedAt(Instant.now()); // Đánh dấu xóa mềm
            productImageRepository.save(img); // Lưu thay đổi
        } catch (Exception e) {
            log.error("Soft delete product image failed, id={}", id, e); // Log ngữ cảnh lỗi
            throw new RuntimeException("Failed to soft delete product image: " + e.getMessage(), e); // Bao lỗi nghiệp vụ
        }
    }

    @Transactional(readOnly = true)
    /** Lấy danh sách ảnh active theo productId. */
    public List<ProductImage> getByProductId(String productId) {
        try {
            return productImageRepository.findActiveByProductId(new ObjectId(productId)); // Truy vấn theo ObjectId
        } catch (Exception e) {
            log.error("Get images by product failed, productId={}", productId, e); // Log lỗi
            throw new RuntimeException("Failed to get product images: " + e.getMessage(), e); // Bao lỗi nghiệp vụ
        }
    }
}

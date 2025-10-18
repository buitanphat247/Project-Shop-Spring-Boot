package com.example.spring_boot.services.products; // Khai báo package của service

import com.example.spring_boot.domains.products.ProductLike; // Domain like sản phẩm
import com.example.spring_boot.repository.products.ProductLikeRepository; // Repository thao tác Mongo cho like

import lombok.RequiredArgsConstructor; // Tự sinh constructor với các field final
import lombok.extern.slf4j.Slf4j; // Log hỗ trợ debug/truy vết
import org.bson.types.ObjectId; // Kiểu ObjectId của MongoDB
import org.springframework.data.mongodb.core.MongoTemplate; // MongoDB template cho query tối ưu
import org.springframework.data.mongodb.core.query.Criteria; // Criteria cho query
import org.springframework.data.mongodb.core.query.Query; // Query builder
import org.springframework.stereotype.Service; // Đánh dấu bean service Spring
import org.springframework.transaction.annotation.Transactional; // Quản lý transaction

import java.time.Instant; // Mốc thời gian UTC
import java.util.List; // Danh sách kết quả

@Service // Bean service để Spring quản lý vòng đời
@RequiredArgsConstructor // Tạo constructor cho field final
@Slf4j // Kích hoạt logging với Lombok
@Transactional // Mặc định transactional cho toàn class
public class ProductLikeService {

    private final ProductLikeRepository productLikeRepository; // DAO truy cập dữ liệu like
    private final MongoTemplate mongoTemplate; // MongoDB template cho query tối ưu

    /** Like sản phẩm cho một người dùng. */
    public ProductLike like(String productId, String userId) {
        try {
            // Đếm số bản ghi like tồn tại theo cặp (productId, userId)
            long exists = productLikeRepository.countByProductIdAndUserId(new ObjectId(productId),
                    new ObjectId(userId));
            if (exists > 0)
                throw new RuntimeException("User already liked this product"); // Chặn like trùng
            // Tạo bản ghi like mới
            ProductLike like = ProductLike.builder()
                    .productId(new ObjectId(productId)) // Gán productId
                    .userId(new ObjectId(userId)) // Gán userId
                    .createdAt(Instant.now()) // Thời điểm tạo
                    .build();
            return productLikeRepository.save(like); // Lưu và trả về
        } catch (Exception e) {
            log.error("Like product failed, productId={}, userId={}", productId, userId, e); // Log ngữ cảnh lỗi
            throw new RuntimeException("Failed to like product: " + e.getMessage(), e); // Bao lỗi nghiệp vụ
        }
    }

    /** Bỏ like (xóa mềm) theo likeId. */
    public void unlike(String likeId) {
        try {
            ProductLike like = productLikeRepository.findById(likeId) // Tìm theo id
                    .orElseThrow(() -> new RuntimeException("Product like not found with ID: " + likeId)); // Không thấy -> lỗi
            if (like.getDeletedAt() != null)
                throw new RuntimeException("Product like has been deleted"); // Đã xóa mềm -> chặn thao tác lặp
            like.setDeletedAt(Instant.now()); // Đánh dấu xóa mềm
            productLikeRepository.save(like); // Lưu cập nhật
        } catch (Exception e) {
            log.error("Unlike product failed, likeId={}", likeId, e); // Log ngữ cảnh lỗi
            throw new RuntimeException("Failed to unlike product: " + e.getMessage(), e); // Bao lỗi nghiệp vụ
        }
    }

    @Transactional(readOnly = true)
    /** Lấy danh sách like đang hoạt động theo productId - TỐI ƯU HÓA với projection. */
    public List<ProductLike> getByProductId(String productId) {
        long startTime = System.currentTimeMillis();
        log.info("❤️ [PERFORMANCE] Getting likes by product: {}", productId);
        
        try {
            Query query = new Query(Criteria.where("productId").is(new ObjectId(productId))
                    .and("deletedAt").isNull());
            query.fields().include("productId", "userId", "createdAt");
            
            List<ProductLike> likes = mongoTemplate.find(query, ProductLike.class);
            
            long endTime = System.currentTimeMillis();
            log.info("✅ [PERFORMANCE] Retrieved {} likes for product {} in {}ms", 
                    likes.size(), productId, endTime - startTime);
            return likes;
        } catch (Exception e) {
            log.error("❌ [PERFORMANCE] Get likes by product failed, productId={}", productId, e);
            throw new RuntimeException("Failed to get product likes: " + e.getMessage(), e);
        }
    }
}

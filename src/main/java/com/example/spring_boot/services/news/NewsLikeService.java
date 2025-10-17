package com.example.spring_boot.services.news; // Package service xử lý like bài viết

import com.example.spring_boot.domains.news.NewsLike; // Entity like
import com.example.spring_boot.repository.news.NewsLikeRepository; // Repository like
import com.example.spring_boot.repository.news.NewsPostRepository; // Repository bài viết
import com.example.spring_boot.repository.UserRepository; // Repository người dùng
import org.bson.types.ObjectId; // ObjectId MongoDB
import org.springframework.http.HttpStatus; // Mã trạng thái HTTP
import org.springframework.stereotype.Service; // Bean service Spring
import org.springframework.web.server.ResponseStatusException; // Exception HTTP chuẩn

import java.time.Instant; // Thời điểm UTC
import java.util.List; // Danh sách kết quả
import java.util.Optional; // Bọc kết quả có thể null
import java.util.logging.Logger; // Logger JDK

/** Service xử lý logic nghiệp vụ cho NewsLike. */
@Service
public class NewsLikeService {
    private final NewsLikeRepository likeRepo; // DAO like
    private final NewsPostRepository postRepo; // DAO bài viết
    private final UserRepository userRepo; // DAO người dùng
    private static final Logger logger = Logger.getLogger(NewsLikeService.class.getName()); // Logger

    public NewsLikeService(NewsLikeRepository likeRepo, NewsPostRepository postRepo, UserRepository userRepo) {
        this.likeRepo = likeRepo; // Inject repo like
        this.postRepo = postRepo; // Inject repo bài viết
        this.userRepo = userRepo; // Inject repo người dùng
    }

    /** Like/Unlike bài viết. */
    public NewsLike toggleLike(String postId, String userId) {
        try {
            if (postId == null || postId.trim().isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Post ID is required"); // Thiếu postId
            }
            if (userId == null || userId.trim().isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User ID is required"); // Thiếu userId
            }

            ObjectId postObjectId = new ObjectId(postId); // Convert sang ObjectId
            ObjectId userObjectId = new ObjectId(userId); // Convert sang ObjectId

            // Kiểm tra post và user tồn tại
            if (!postRepo.existsById(postId)) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Post not found");
            }
            if (!userRepo.existsById(userId)) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User not found");
            }

            Optional<NewsLike> existingLike = likeRepo.findByPostIdAndUserId(postObjectId, userObjectId);

            if (existingLike.isPresent()) {
                // Unlike: soft delete
                NewsLike like = existingLike.get();
                like.setDeletedAt(Instant.now()); // Đánh dấu xóa mềm
                NewsLike updatedLike = likeRepo.save(like); // Lưu thay đổi
                logger.info("News like removed for post: " + postId + ", user: " + userId); // Log thành công
                return updatedLike; // Trả về kết quả
            } else {
                // Like: tạo mới
                NewsLike like = NewsLike.builder()
                        .postId(postObjectId) // Tham chiếu bài viết
                        .userId(userObjectId) // Tham chiếu người dùng
                        .createdAt(Instant.now()) // Thời điểm tạo
                        .build();

                NewsLike savedLike = likeRepo.save(like); // Lưu like mới

                // Fallback populate nếu DocumentReference không hoạt động
                if (savedLike.getPost() == null && savedLike.getPostId() != null) {
                    postRepo.findById(savedLike.getPostId().toHexString()).ifPresent(savedLike::setPost);
                }
                if (savedLike.getUser() == null && savedLike.getUserId() != null) {
                    userRepo.findById(savedLike.getUserId().toHexString()).ifPresent(savedLike::setUser);
                }

                logger.info("News like created for post: " + postId + ", user: " + userId); // Log thành công
                return savedLike; // Trả về kết quả
            }

        } catch (ResponseStatusException e) {
            logger.warning("News like toggle failed: " + e.getReason()); // Log cảnh báo
            throw e; // Ném lại cho controller
        } catch (Exception e) {
            logger.severe("Unexpected error toggling news like: " + e.getMessage()); // Lỗi hệ thống
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to toggle news like");
        }
    }

    /** Lấy danh sách like theo post ID. */
    public List<NewsLike> getByPostId(String postId) {
        try {
            if (postId == null || postId.trim().isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Post ID is required"); // Thiếu postId
            }

            ObjectId postObjectId = new ObjectId(postId); // Convert id
            List<NewsLike> likes = likeRepo.findByPostId(postObjectId); // Truy vấn theo postId

            // Fallback populate
            for (NewsLike like : likes) {
                if (like.getPost() == null && like.getPostId() != null) {
                    postRepo.findById(like.getPostId().toHexString()).ifPresent(like::setPost);
                }
                if (like.getUser() == null && like.getUserId() != null) {
                    userRepo.findById(like.getUserId().toHexString()).ifPresent(like::setUser);
                }
            }

            logger.info("Retrieved " + likes.size() + " likes for post: " + postId); // Log số lượng
            return likes; // Trả về danh sách

        } catch (ResponseStatusException e) {
            logger.warning("Failed to retrieve likes by post ID: " + e.getReason()); // Log cảnh báo
            throw e; // Ném lại cho controller
        } catch (Exception e) {
            logger.severe("Unexpected error retrieving likes by post ID: " + e.getMessage()); // Lỗi hệ thống
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to retrieve likes");
        }
    }

    /** Lấy danh sách like theo user ID. */
    public List<NewsLike> getByUserId(String userId) {
        try {
            if (userId == null || userId.trim().isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User ID is required"); // Thiếu userId
            }

            ObjectId userObjectId = new ObjectId(userId); // Convert id
            List<NewsLike> likes = likeRepo.findByUserId(userObjectId); // Truy vấn theo userId

            // Fallback populate
            for (NewsLike like : likes) {
                if (like.getPost() == null && like.getPostId() != null) {
                    postRepo.findById(like.getPostId().toHexString()).ifPresent(like::setPost);
                }
                if (like.getUser() == null && like.getUserId() != null) {
                    userRepo.findById(like.getUserId().toHexString()).ifPresent(like::setUser);
                }
            }

            logger.info("Retrieved " + likes.size() + " likes for user: " + userId); // Log số lượng
            return likes; // Trả về danh sách

        } catch (ResponseStatusException e) {
            logger.warning("Failed to retrieve likes by user ID: " + e.getReason()); // Log cảnh báo
            throw e; // Ném lại cho controller
        } catch (Exception e) {
            logger.severe("Unexpected error retrieving likes by user ID: " + e.getMessage()); // Lỗi hệ thống
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to retrieve likes");
        }
    }

    /** Kiểm tra user đã like post chưa. */
    public boolean hasUserLiked(String postId, String userId) {
        try {
            if (postId == null || postId.trim().isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Post ID is required"); // Thiếu postId
            }
            if (userId == null || userId.trim().isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User ID is required"); // Thiếu userId
            }

            ObjectId postObjectId = new ObjectId(postId); // Convert id
            ObjectId userObjectId = new ObjectId(userId); // Convert id
            boolean hasLiked = likeRepo.existsByPostIdAndUserId(postObjectId, userObjectId); // Kiểm tra tồn tại

            // Log kết quả kiểm tra
            logger.info("Checked like status for post: " + postId + ", user: " + userId + ", hasLiked: " + hasLiked);

            return hasLiked; // Trả về boolean

        } catch (ResponseStatusException e) {
            logger.warning("Failed to check like status: " + e.getReason()); // Log cảnh báo
            throw e; // Ném lại cho controller
        } catch (Exception e) {
            logger.severe("Unexpected error checking like status: " + e.getMessage()); // Lỗi hệ thống
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to check like status");
        }
    }

    /** Đếm số like của post. */
    public long countLikes(String postId) {
        try {
            if (postId == null || postId.trim().isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Post ID is required"); // Thiếu postId
            }

            ObjectId postObjectId = new ObjectId(postId); // Convert id
            long count = likeRepo.countByPostId(postObjectId); // Đếm theo postId

            logger.info("Counted " + count + " likes for post: " + postId); // Log số lượng
            return count; // Trả về số lượng

        } catch (ResponseStatusException e) {
            logger.warning("Failed to count likes: " + e.getReason()); // Log cảnh báo
            throw e; // Ném lại cho controller
        } catch (Exception e) {
            logger.severe("Unexpected error counting likes: " + e.getMessage()); // Lỗi hệ thống
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to count likes");
        }
    }
}

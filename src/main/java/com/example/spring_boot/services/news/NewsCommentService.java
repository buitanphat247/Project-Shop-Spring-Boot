package com.example.spring_boot.services.news; // Package service xử lý comment bài viết

import com.example.spring_boot.domains.news.NewsComment; // Entity comment
import com.example.spring_boot.repository.news.NewsCommentRepository; // Repository comment
import com.example.spring_boot.repository.news.NewsPostRepository; // Repository bài viết
import com.example.spring_boot.repository.UserRepository; // Repository người dùng
import com.example.spring_boot.utils.ValidationUtils; // Tiện ích normalize
import org.bson.types.ObjectId; // ObjectId MongoDB
import org.springframework.http.HttpStatus; // Mã trạng thái HTTP
import org.springframework.stereotype.Service; // Bean service Spring
import org.springframework.web.server.ResponseStatusException; // Exception HTTP chuẩn

import java.time.Instant; // Thời điểm UTC
import java.util.List; // Danh sách kết quả
import java.util.logging.Logger; // Logger JDK

/** Service xử lý logic nghiệp vụ cho NewsComment. */
@Service
public class NewsCommentService {
    private final NewsCommentRepository commentRepo; // DAO comment
    private final NewsPostRepository postRepo; // DAO bài viết
    private final UserRepository userRepo; // DAO người dùng
    private static final Logger logger = Logger.getLogger(NewsCommentService.class.getName()); // Logger

    public NewsCommentService(NewsCommentRepository commentRepo, NewsPostRepository postRepo, UserRepository userRepo) {
        this.commentRepo = commentRepo; // Inject repo comment
        this.postRepo = postRepo; // Inject repo bài viết
        this.userRepo = userRepo; // Inject repo người dùng
    }

    /** Tạo comment mới. */
    public NewsComment create(NewsComment input) {
        try {
            if (input == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Comment data is required"); // Thiếu payload
            }
            
            String content = ValidationUtils.normalize(input.getContent()); // Chuẩn hóa nội dung
            if (content == null || content.trim().isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Content is required"); // Bắt buộc nội dung
            }

            ObjectId postId = input.getPostId(); // Bài viết
            if (postId == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Post ID is required");
            }
            if (!postRepo.existsById(postId.toHexString())) { // Không tồn tại -> lỗi
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Post not found");
            }

            ObjectId userId = input.getUserId(); // Người dùng
            if (userId == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User ID is required");
            }
            if (!userRepo.existsById(userId.toHexString())) { // Không tồn tại -> lỗi
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User not found");
            }

            // Validate parentId nếu có
            ObjectId parentId = input.getParentId(); // Cha (nếu là reply)
            if (parentId != null && !commentRepo.existsById(parentId.toHexString())) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Parent comment not found");
            }

            NewsComment comment = NewsComment.builder()
                    .postId(postId) // Tham chiếu bài viết
                    .userId(userId) // Tham chiếu người dùng
                    .content(content) // Nội dung đã chuẩn hóa
                    .parentId(parentId) // Comment cha nếu có
                    .createdAt(Instant.now()) // Thời điểm tạo
                    .build();
            
            NewsComment savedComment = commentRepo.save(comment); // Lưu và nhận entity đã lưu
            
            // Fallback populate nếu DocumentReference không hoạt động
            if (savedComment.getPost() == null && savedComment.getPostId() != null) {
                postRepo.findById(savedComment.getPostId().toHexString()).ifPresent(savedComment::setPost);
            }
            if (savedComment.getUser() == null && savedComment.getUserId() != null) {
                userRepo.findById(savedComment.getUserId().toHexString()).ifPresent(savedComment::setUser);
            }
            if (savedComment.getParent() == null && savedComment.getParentId() != null) {
                commentRepo.findById(savedComment.getParentId().toHexString()).ifPresent(savedComment::setParent);
            }
            
            logger.info("News comment created successfully: " + savedComment.getId()); // Log thành công
            return savedComment; // Trả về kết quả
            
        } catch (ResponseStatusException e) {
            logger.warning("News comment creation failed: " + e.getReason()); // Log cảnh báo
            throw e; // Ném lại cho controller
        } catch (Exception e) {
            logger.severe("Unexpected error creating news comment: " + e.getMessage()); // Lỗi hệ thống
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to create news comment");
        }
    }

    /** Lấy comment theo post ID. */
    public List<NewsComment> getByPostId(String postId) {
        try {
            if (postId == null || postId.trim().isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Post ID is required"); // Thiếu postId
            }
            
            ObjectId postObjectId = new ObjectId(postId); // Convert id
            List<NewsComment> comments = commentRepo.findByPostIdOrderByCreatedAtDesc(postObjectId); // Truy vấn theo postId
            
            // Fallback populate cho tất cả comments
            for (NewsComment comment : comments) {
                if (comment.getPost() == null && comment.getPostId() != null) {
                    postRepo.findById(comment.getPostId().toHexString()).ifPresent(comment::setPost);
                }
                if (comment.getUser() == null && comment.getUserId() != null) {
                    userRepo.findById(comment.getUserId().toHexString()).ifPresent(comment::setUser);
                }
                if (comment.getParent() == null && comment.getParentId() != null) {
                    commentRepo.findById(comment.getParentId().toHexString()).ifPresent(comment::setParent);
                }
            }
            
            logger.info("Retrieved " + comments.size() + " comments for post: " + postId); // Log số lượng
            return comments; // Trả về danh sách
            
        } catch (ResponseStatusException e) {
            logger.warning("Failed to retrieve comments by post ID: " + e.getReason()); // Log cảnh báo
            throw e; // Ném lại cho controller
        } catch (Exception e) {
            logger.severe("Unexpected error retrieving comments by post ID: " + e.getMessage()); // Lỗi hệ thống
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to retrieve comments");
        }
    }

    /** Lấy comment theo user ID. */
    public List<NewsComment> getByUserId(String userId) {
        try {
            if (userId == null || userId.trim().isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User ID is required"); // Thiếu userId
            }
            
            ObjectId userObjectId = new ObjectId(userId); // Convert id
            List<NewsComment> comments = commentRepo.findByUserIdOrderByCreatedAtDesc(userObjectId); // Truy vấn theo userId
            
            // Fallback populate
            for (NewsComment comment : comments) {
                if (comment.getPost() == null && comment.getPostId() != null) {
                    postRepo.findById(comment.getPostId().toHexString()).ifPresent(comment::setPost);
                }
                if (comment.getUser() == null && comment.getUserId() != null) {
                    userRepo.findById(comment.getUserId().toHexString()).ifPresent(comment::setUser);
                }
            }
            
            logger.info("Retrieved " + comments.size() + " comments for user: " + userId); // Log số lượng
            return comments; // Trả về danh sách
            
        } catch (ResponseStatusException e) {
            logger.warning("Failed to retrieve comments by user ID: " + e.getReason()); // Log cảnh báo
            throw e; // Ném lại cho controller
        } catch (Exception e) {
            logger.severe("Unexpected error retrieving comments by user ID: " + e.getMessage()); // Lỗi hệ thống
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to retrieve comments");
        }
    }

    /** Lấy comment theo ID. */
    public NewsComment get(String id) {
        try {
            if (id == null || id.trim().isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Comment ID is required"); // Thiếu id
            }
            
            NewsComment comment = commentRepo.findById(id)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Comment not found")); // Không thấy -> 404
            
            // Fallback populate
            if (comment.getPost() == null && comment.getPostId() != null) {
                postRepo.findById(comment.getPostId().toHexString()).ifPresent(comment::setPost);
            }
            if (comment.getUser() == null && comment.getUserId() != null) {
                userRepo.findById(comment.getUserId().toHexString()).ifPresent(comment::setUser);
            }
            if (comment.getParent() == null && comment.getParentId() != null) {
                commentRepo.findById(comment.getParentId().toHexString()).ifPresent(comment::setParent);
            }
            
            logger.info("Retrieved comment: " + comment.getId()); // Log thành công
            return comment; // Trả về entity
            
        } catch (ResponseStatusException e) {
            logger.warning("Comment retrieval failed: " + e.getReason()); // Log cảnh báo
            throw e; // Ném lại cho controller
        } catch (Exception e) {
            logger.severe("Unexpected error retrieving comment: " + e.getMessage()); // Lỗi hệ thống
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to retrieve comment");
        }
    }

    /** Cập nhật comment. */
    public NewsComment update(String id, NewsComment input) {
        try {
            if (input == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Comment data is required"); // Thiếu payload
            }
            
            NewsComment existingComment = get(id); // Lấy bản hiện có hoặc 404
            
            String content = ValidationUtils.normalize(input.getContent()); // Chuẩn hóa nội dung
            if (content != null && !content.trim().isEmpty()) {
                existingComment.setContent(content); // Cập nhật khi hợp lệ
            }
            
            existingComment.setUpdatedAt(Instant.now()); // Thời điểm cập nhật
            NewsComment updatedComment = commentRepo.save(existingComment); // Lưu thay đổi
            
            logger.info("Comment updated successfully: " + updatedComment.getId()); // Log thành công
            return updatedComment; // Trả về kết quả
            
        } catch (ResponseStatusException e) {
            logger.warning("Comment update failed: " + e.getReason()); // Log cảnh báo
            throw e; // Ném lại cho controller
        } catch (Exception e) {
            logger.severe("Unexpected error updating comment: " + e.getMessage()); // Lỗi hệ thống
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to update comment");
        }
    }

    /** Xóa comment (soft delete). */
    public void delete(String id) {
        try {
            if (id == null || id.trim().isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Comment ID is required"); // Thiếu id
            }
            
            NewsComment comment = get(id); // Lấy bản hiện có
            comment.setDeletedAt(Instant.now()); // Đánh dấu xóa mềm
            commentRepo.save(comment); // Lưu thay đổi
            
            logger.info("Comment deleted successfully: " + id); // Log thành công
            
        } catch (ResponseStatusException e) {
            logger.warning("Comment deletion failed: " + e.getReason()); // Log cảnh báo
            throw e; // Ném lại cho controller
        } catch (Exception e) {
            logger.severe("Unexpected error deleting comment: " + e.getMessage()); // Lỗi hệ thống
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to delete comment");
        }
    }
}

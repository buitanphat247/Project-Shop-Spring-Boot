package com.example.spring_boot.services.news;

import com.example.spring_boot.domains.news.NewsComment;
import com.example.spring_boot.repository.news.NewsCommentRepository;
import com.example.spring_boot.repository.news.NewsPostRepository;
import com.example.spring_boot.repository.UserRepository;
import com.example.spring_boot.utils.ValidationUtils;
import org.bson.types.ObjectId;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.List;
import java.util.logging.Logger;

/**
 * Service xử lý logic nghiệp vụ cho NewsComment
 * Sử dụng ObjectId embed và DocumentReference để tự động populate
 */
@Service
public class NewsCommentService {
    private final NewsCommentRepository commentRepo;
    private final NewsPostRepository postRepo;
    private final UserRepository userRepo;
    private static final Logger logger = Logger.getLogger(NewsCommentService.class.getName());

    public NewsCommentService(NewsCommentRepository commentRepo, NewsPostRepository postRepo, UserRepository userRepo) {
        this.commentRepo = commentRepo;
        this.postRepo = postRepo;
        this.userRepo = userRepo;
    }

    /**
     * Tạo comment mới
     */
    public NewsComment create(NewsComment input) {
        try {
            if (input == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Comment data is required");
            }
            
            String content = ValidationUtils.normalize(input.getContent());
            if (content == null || content.trim().isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Content is required");
            }

            ObjectId postId = input.getPostId();
            if (postId == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Post ID is required");
            }
            if (!postRepo.existsById(postId.toHexString())) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Post not found");
            }

            ObjectId userId = input.getUserId();
            if (userId == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User ID is required");
            }
            if (!userRepo.existsById(userId.toHexString())) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User not found");
            }

            // Validate parentId nếu có
            ObjectId parentId = input.getParentId();
            if (parentId != null && !commentRepo.existsById(parentId.toHexString())) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Parent comment not found");
            }

            NewsComment comment = NewsComment.builder()
                    .postId(postId)
                    .userId(userId)
                    .content(content)
                    .parentId(parentId)
                    .createdAt(Instant.now())
                    .build();
            
            NewsComment savedComment = commentRepo.save(comment);
            
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
            
            logger.info("News comment created successfully: " + savedComment.getId());
            return savedComment;
            
        } catch (ResponseStatusException e) {
            logger.warning("News comment creation failed: " + e.getReason());
            throw e;
        } catch (Exception e) {
            logger.severe("Unexpected error creating news comment: " + e.getMessage());
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to create news comment");
        }
    }

    /**
     * Lấy comment theo post ID
     */
    public List<NewsComment> getByPostId(String postId) {
        try {
            if (postId == null || postId.trim().isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Post ID is required");
            }
            
            ObjectId postObjectId = new ObjectId(postId);
            List<NewsComment> comments = commentRepo.findByPostIdOrderByCreatedAtDesc(postObjectId);
            
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
            
            logger.info("Retrieved " + comments.size() + " comments for post: " + postId);
            return comments;
            
        } catch (ResponseStatusException e) {
            logger.warning("Failed to retrieve comments by post ID: " + e.getReason());
            throw e;
        } catch (Exception e) {
            logger.severe("Unexpected error retrieving comments by post ID: " + e.getMessage());
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to retrieve comments");
        }
    }

    /**
     * Lấy comment theo user ID
     */
    public List<NewsComment> getByUserId(String userId) {
        try {
            if (userId == null || userId.trim().isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User ID is required");
            }
            
            ObjectId userObjectId = new ObjectId(userId);
            List<NewsComment> comments = commentRepo.findByUserIdOrderByCreatedAtDesc(userObjectId);
            
            // Fallback populate
            for (NewsComment comment : comments) {
                if (comment.getPost() == null && comment.getPostId() != null) {
                    postRepo.findById(comment.getPostId().toHexString()).ifPresent(comment::setPost);
                }
                if (comment.getUser() == null && comment.getUserId() != null) {
                    userRepo.findById(comment.getUserId().toHexString()).ifPresent(comment::setUser);
                }
            }
            
            logger.info("Retrieved " + comments.size() + " comments for user: " + userId);
            return comments;
            
        } catch (ResponseStatusException e) {
            logger.warning("Failed to retrieve comments by user ID: " + e.getReason());
            throw e;
        } catch (Exception e) {
            logger.severe("Unexpected error retrieving comments by user ID: " + e.getMessage());
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to retrieve comments");
        }
    }

    /**
     * Lấy comment theo ID
     */
    public NewsComment get(String id) {
        try {
            if (id == null || id.trim().isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Comment ID is required");
            }
            
            NewsComment comment = commentRepo.findById(id)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Comment not found"));
            
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
            
            logger.info("Retrieved comment: " + comment.getId());
            return comment;
            
        } catch (ResponseStatusException e) {
            logger.warning("Comment retrieval failed: " + e.getReason());
            throw e;
        } catch (Exception e) {
            logger.severe("Unexpected error retrieving comment: " + e.getMessage());
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to retrieve comment");
        }
    }

    /**
     * Cập nhật comment
     */
    public NewsComment update(String id, NewsComment input) {
        try {
            if (input == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Comment data is required");
            }
            
            NewsComment existingComment = get(id);
            
            String content = ValidationUtils.normalize(input.getContent());
            if (content != null && !content.trim().isEmpty()) {
                existingComment.setContent(content);
            }
            
            existingComment.setUpdatedAt(Instant.now());
            NewsComment updatedComment = commentRepo.save(existingComment);
            
            logger.info("Comment updated successfully: " + updatedComment.getId());
            return updatedComment;
            
        } catch (ResponseStatusException e) {
            logger.warning("Comment update failed: " + e.getReason());
            throw e;
        } catch (Exception e) {
            logger.severe("Unexpected error updating comment: " + e.getMessage());
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to update comment");
        }
    }

    /**
     * Xóa comment (soft delete)
     */
    public void delete(String id) {
        try {
            if (id == null || id.trim().isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Comment ID is required");
            }
            
            NewsComment comment = get(id);
            comment.setDeletedAt(Instant.now());
            commentRepo.save(comment);
            
            logger.info("Comment deleted successfully: " + id);
            
        } catch (ResponseStatusException e) {
            logger.warning("Comment deletion failed: " + e.getReason());
            throw e;
        } catch (Exception e) {
            logger.severe("Unexpected error deleting comment: " + e.getMessage());
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to delete comment");
        }
    }
}

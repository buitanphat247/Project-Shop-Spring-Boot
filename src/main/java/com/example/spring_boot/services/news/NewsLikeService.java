package com.example.spring_boot.services.news;

import com.example.spring_boot.domains.news.NewsLike;
import com.example.spring_boot.repository.news.NewsLikeRepository;
import com.example.spring_boot.repository.news.NewsPostRepository;
import com.example.spring_boot.repository.UserRepository;
import org.bson.types.ObjectId;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.logging.Logger;

/**
 * Service xử lý logic nghiệp vụ cho NewsLike
 * Sử dụng ObjectId embed và DocumentReference để tự động populate
 */
@Service
public class NewsLikeService {
    private final NewsLikeRepository likeRepo;
    private final NewsPostRepository postRepo;
    private final UserRepository userRepo;
    private static final Logger logger = Logger.getLogger(NewsLikeService.class.getName());

    public NewsLikeService(NewsLikeRepository likeRepo, NewsPostRepository postRepo, UserRepository userRepo) {
        this.likeRepo = likeRepo;
        this.postRepo = postRepo;
        this.userRepo = userRepo;
    }

    /**
     * Like/Unlike bài viết
     */
    public NewsLike toggleLike(String postId, String userId) {
        try {
            if (postId == null || postId.trim().isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Post ID is required");
            }
            if (userId == null || userId.trim().isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User ID is required");
            }
            
            ObjectId postObjectId = new ObjectId(postId);
            ObjectId userObjectId = new ObjectId(userId);
            
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
                like.setDeletedAt(Instant.now());
                NewsLike updatedLike = likeRepo.save(like);
                logger.info("News like removed for post: " + postId + ", user: " + userId);
                return updatedLike;
            } else {
                // Like: tạo mới
                NewsLike like = NewsLike.builder()
                        .postId(postObjectId)
                        .userId(userObjectId)
                        .createdAt(Instant.now())
                        .build();
                
                NewsLike savedLike = likeRepo.save(like);
                
                // Fallback populate nếu DocumentReference không hoạt động
                if (savedLike.getPost() == null && savedLike.getPostId() != null) {
                    postRepo.findById(savedLike.getPostId().toHexString()).ifPresent(savedLike::setPost);
                }
                if (savedLike.getUser() == null && savedLike.getUserId() != null) {
                    userRepo.findById(savedLike.getUserId().toHexString()).ifPresent(savedLike::setUser);
                }
                
                logger.info("News like created for post: " + postId + ", user: " + userId);
                return savedLike;
            }
            
        } catch (ResponseStatusException e) {
            logger.warning("News like toggle failed: " + e.getReason());
            throw e;
        } catch (Exception e) {
            logger.severe("Unexpected error toggling news like: " + e.getMessage());
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to toggle news like");
        }
    }

    /**
     * Lấy danh sách like theo post ID
     */
    public List<NewsLike> getByPostId(String postId) {
        try {
            if (postId == null || postId.trim().isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Post ID is required");
            }
            
            ObjectId postObjectId = new ObjectId(postId);
            List<NewsLike> likes = likeRepo.findByPostId(postObjectId);
            
            // Fallback populate
            for (NewsLike like : likes) {
                if (like.getPost() == null && like.getPostId() != null) {
                    postRepo.findById(like.getPostId().toHexString()).ifPresent(like::setPost);
                }
                if (like.getUser() == null && like.getUserId() != null) {
                    userRepo.findById(like.getUserId().toHexString()).ifPresent(like::setUser);
                }
            }
            
            logger.info("Retrieved " + likes.size() + " likes for post: " + postId);
            return likes;
            
        } catch (ResponseStatusException e) {
            logger.warning("Failed to retrieve likes by post ID: " + e.getReason());
            throw e;
        } catch (Exception e) {
            logger.severe("Unexpected error retrieving likes by post ID: " + e.getMessage());
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to retrieve likes");
        }
    }

    /**
     * Lấy danh sách like theo user ID
     */
    public List<NewsLike> getByUserId(String userId) {
        try {
            if (userId == null || userId.trim().isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User ID is required");
            }
            
            ObjectId userObjectId = new ObjectId(userId);
            List<NewsLike> likes = likeRepo.findByUserId(userObjectId);
            
            // Fallback populate
            for (NewsLike like : likes) {
                if (like.getPost() == null && like.getPostId() != null) {
                    postRepo.findById(like.getPostId().toHexString()).ifPresent(like::setPost);
                }
                if (like.getUser() == null && like.getUserId() != null) {
                    userRepo.findById(like.getUserId().toHexString()).ifPresent(like::setUser);
                }
            }
            
            logger.info("Retrieved " + likes.size() + " likes for user: " + userId);
            return likes;
            
        } catch (ResponseStatusException e) {
            logger.warning("Failed to retrieve likes by user ID: " + e.getReason());
            throw e;
        } catch (Exception e) {
            logger.severe("Unexpected error retrieving likes by user ID: " + e.getMessage());
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to retrieve likes");
        }
    }

    /**
     * Kiểm tra user đã like post chưa
     */
    public boolean hasUserLiked(String postId, String userId) {
        try {
            if (postId == null || postId.trim().isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Post ID is required");
            }
            if (userId == null || userId.trim().isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User ID is required");
            }
            
            ObjectId postObjectId = new ObjectId(postId);
            ObjectId userObjectId = new ObjectId(userId);
            boolean hasLiked = likeRepo.existsByPostIdAndUserId(postObjectId, userObjectId);
            
            logger.info("Checked like status for post: " + postId + ", user: " + userId + ", hasLiked: " + hasLiked);
            return hasLiked;
            
        } catch (ResponseStatusException e) {
            logger.warning("Failed to check like status: " + e.getReason());
            throw e;
        } catch (Exception e) {
            logger.severe("Unexpected error checking like status: " + e.getMessage());
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to check like status");
        }
    }

    /**
     * Đếm số like của post
     */
    public long countLikes(String postId) {
        try {
            if (postId == null || postId.trim().isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Post ID is required");
            }
            
            ObjectId postObjectId = new ObjectId(postId);
            long count = likeRepo.countByPostId(postObjectId);
            
            logger.info("Counted " + count + " likes for post: " + postId);
            return count;
            
        } catch (ResponseStatusException e) {
            logger.warning("Failed to count likes: " + e.getReason());
            throw e;
        } catch (Exception e) {
            logger.severe("Unexpected error counting likes: " + e.getMessage());
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to count likes");
        }
    }
}

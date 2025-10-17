package com.example.spring_boot.services.news;

import com.example.spring_boot.domains.news.NewsPost;
import com.example.spring_boot.repository.news.NewsPostRepository;
import com.example.spring_boot.repository.news.NewsCategoryRepository;
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
 * Service xử lý logic nghiệp vụ cho NewsPost
 * Sử dụng ObjectId embed và DocumentReference để tự động populate
 */
@Service
public class NewsPostService {
    private final NewsPostRepository postRepo;
    private final NewsCategoryRepository categoryRepo;
    private final UserRepository userRepo;
    private static final Logger logger = Logger.getLogger(NewsPostService.class.getName());

    public NewsPostService(NewsPostRepository postRepo, NewsCategoryRepository categoryRepo, UserRepository userRepo) {
        this.postRepo = postRepo;
        this.categoryRepo = categoryRepo;
        this.userRepo = userRepo;
    }

    /**
     * Tạo bài viết mới
     */
    public NewsPost create(NewsPost input) {
        try {
            if (input == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Post data is required");
            }
            
            String title = ValidationUtils.normalize(input.getTitle());
            if (title == null || title.trim().isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Title is required");
            }
            
            String slug = ValidationUtils.normalize(input.getSlug());
            if (slug == null || slug.trim().isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Slug is required");
            }
            
            if (postRepo.existsBySlug(slug)) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "Slug already exists");
            }

            // Validate authorId và categoryId
            ObjectId authorId = input.getAuthorId();
            if (authorId == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Author ID is required");
            }
            if (!userRepo.existsById(authorId.toHexString())) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Author not found");
            }

            ObjectId categoryId = input.getCategoryId();
            if (categoryId == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Category ID is required");
            }
            if (!categoryRepo.existsById(categoryId.toHexString())) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Category not found");
            }

            NewsPost post = NewsPost.builder()
                    .title(title)
                    .slug(slug)
                    .content(ValidationUtils.normalize(input.getContent()))
                    .thumbnailUrl(ValidationUtils.normalize(input.getThumbnailUrl()))
                    .authorId(authorId)
                    .categoryId(categoryId)
                    .isPublished(input.isPublished())
                    .publishedAt(input.isPublished() ? Instant.now() : null)
                    .createdAt(Instant.now())
                    .build();
            
            NewsPost savedPost = postRepo.save(post);
            
            // Fallback populate nếu DocumentReference không hoạt động
            if (savedPost.getAuthor() == null && savedPost.getAuthorId() != null) {
                userRepo.findById(savedPost.getAuthorId().toHexString()).ifPresent(savedPost::setAuthor);
            }
            if (savedPost.getCategory() == null && savedPost.getCategoryId() != null) {
                categoryRepo.findById(savedPost.getCategoryId().toHexString()).ifPresent(savedPost::setCategory);
            }
            
            logger.info("News post created successfully: " + savedPost.getId());
            return savedPost;
            
        } catch (ResponseStatusException e) {
            logger.warning("News post creation failed: " + e.getReason());
            throw e;
        } catch (Exception e) {
            logger.severe("Unexpected error creating news post: " + e.getMessage());
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to create news post");
        }
    }

    /**
     * Lấy danh sách bài viết
     */
    public List<NewsPost> list(String title, Boolean published) {
        try {
            String keyword = ValidationUtils.normalize(title);
            List<NewsPost> posts;
            
            if (published != null && published) {
                posts = keyword == null ? 
                    postRepo.findByIsPublishedTrue() : 
                    postRepo.findByIsPublishedTrueAndTitleContainingIgnoreCase(keyword);
            } else {
                posts = keyword == null ? 
                    postRepo.findAll() : 
                    postRepo.findByTitleContainingIgnoreCase(keyword);
            }
            
            // Fallback populate cho tất cả posts
            for (NewsPost post : posts) {
                if (post.getAuthor() == null && post.getAuthorId() != null) {
                    userRepo.findById(post.getAuthorId().toHexString()).ifPresent(post::setAuthor);
                }
                if (post.getCategory() == null && post.getCategoryId() != null) {
                    categoryRepo.findById(post.getCategoryId().toHexString()).ifPresent(post::setCategory);
                }
            }
            
            logger.info("Retrieved " + posts.size() + " news posts");
            return posts;
            
        } catch (Exception e) {
            logger.severe("Error retrieving news posts: " + e.getMessage());
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to retrieve news posts");
        }
    }

    /**
     * Lấy bài viết theo ID
     */
    public NewsPost get(String id) {
        try {
            if (id == null || id.trim().isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Post ID is required");
            }
            
            NewsPost post = postRepo.findById(id)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "News post not found"));
            
            // Fallback populate nếu DocumentReference không hoạt động
            if (post.getAuthor() == null && post.getAuthorId() != null) {
                userRepo.findById(post.getAuthorId().toHexString()).ifPresent(post::setAuthor);
            }
            if (post.getCategory() == null && post.getCategoryId() != null) {
                categoryRepo.findById(post.getCategoryId().toHexString()).ifPresent(post::setCategory);
            }
            
            logger.info("Retrieved news post: " + post.getId());
            return post;
            
        } catch (ResponseStatusException e) {
            logger.warning("News post retrieval failed: " + e.getReason());
            throw e;
        } catch (Exception e) {
            logger.severe("Unexpected error retrieving news post: " + e.getMessage());
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to retrieve news post");
        }
    }

    /**
     * Cập nhật bài viết
     */
    public NewsPost update(String id, NewsPost input) {
        try {
            if (input == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Post data is required");
            }
            
            NewsPost existingPost = get(id);
            
            String title = ValidationUtils.normalize(input.getTitle());
            if (title != null && !title.equals(existingPost.getTitle())) {
                existingPost.setTitle(title);
            }
            
            String slug = ValidationUtils.normalize(input.getSlug());
            if (slug != null && !slug.equals(existingPost.getSlug())) {
                if (postRepo.existsBySlug(slug)) {
                    throw new ResponseStatusException(HttpStatus.CONFLICT, "Slug already exists");
                }
                existingPost.setSlug(slug);
            }
            
            String content = ValidationUtils.normalize(input.getContent());
            if (content != null) {
                existingPost.setContent(content);
            }
            
            String thumbnailUrl = ValidationUtils.normalize(input.getThumbnailUrl());
            if (thumbnailUrl != null) {
                existingPost.setThumbnailUrl(thumbnailUrl);
            }
            
            if (input.getAuthorId() != null) {
                if (!userRepo.existsById(input.getAuthorId().toHexString())) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Author not found");
                }
                existingPost.setAuthorId(input.getAuthorId());
            }
            
            if (input.getCategoryId() != null) {
                if (!categoryRepo.existsById(input.getCategoryId().toHexString())) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Category not found");
                }
                existingPost.setCategoryId(input.getCategoryId());
            }
            
            if (input.isPublished() != existingPost.isPublished()) {
                existingPost.setPublished(input.isPublished());
                if (input.isPublished() && existingPost.getPublishedAt() == null) {
                    existingPost.setPublishedAt(Instant.now());
                }
            }
            
            existingPost.setUpdatedAt(Instant.now());
            NewsPost updatedPost = postRepo.save(existingPost);
            
            logger.info("News post updated successfully: " + updatedPost.getId());
            return updatedPost;
            
        } catch (ResponseStatusException e) {
            logger.warning("News post update failed: " + e.getReason());
            throw e;
        } catch (Exception e) {
            logger.severe("Unexpected error updating news post: " + e.getMessage());
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to update news post");
        }
    }

    /**
     * Xóa bài viết (soft delete)
     */
    public void delete(String id) {
        try {
            if (id == null || id.trim().isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Post ID is required");
            }
            
            NewsPost post = get(id);
            post.setDeletedAt(Instant.now());
            postRepo.save(post);
            
            logger.info("News post deleted successfully: " + id);
            
        } catch (ResponseStatusException e) {
            logger.warning("News post deletion failed: " + e.getReason());
            throw e;
        } catch (Exception e) {
            logger.severe("Unexpected error deleting news post: " + e.getMessage());
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to delete news post");
        }
    }
}

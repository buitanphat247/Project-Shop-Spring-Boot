package com.example.spring_boot.services.news; // Package service xử lý bài viết tin tức

import com.example.spring_boot.domains.news.NewsPost; // Entity bài viết
import com.example.spring_boot.repository.news.NewsPostRepository; // Repository bài viết
import com.example.spring_boot.repository.news.NewsCategoryRepository; // Repository danh mục
import com.example.spring_boot.repository.UserRepository; // Repository người dùng
import com.example.spring_boot.utils.ValidationUtils; // Tiện ích normalize dữ liệu
import org.bson.types.ObjectId; // ObjectId MongoDB
import org.springframework.http.HttpStatus; // Mã trạng thái HTTP
import org.springframework.stereotype.Service; // Bean service Spring
import org.springframework.web.server.ResponseStatusException; // Exception HTTP chuẩn

import java.time.Instant; // Thời điểm UTC
import java.util.List; // Danh sách kết quả
import java.util.logging.Logger; // Logger JDK

/** Service xử lý logic nghiệp vụ cho NewsPost. */
@Service
public class NewsPostService {
    private final NewsPostRepository postRepo; // DAO bài viết
    private final NewsCategoryRepository categoryRepo; // DAO danh mục bài viết
    private final UserRepository userRepo; // DAO người dùng
    private static final Logger logger = Logger.getLogger(NewsPostService.class.getName()); // Logger

    public NewsPostService(NewsPostRepository postRepo, NewsCategoryRepository categoryRepo, UserRepository userRepo) {
        this.postRepo = postRepo; // Inject repo bài viết
        this.categoryRepo = categoryRepo; // Inject repo danh mục
        this.userRepo = userRepo; // Inject repo người dùng
    }

    /** Tạo bài viết mới. */
    public NewsPost create(NewsPost input) {
        try {
            if (input == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Post data is required"); // Thiếu payload
            }

            String title = ValidationUtils.normalize(input.getTitle()); // Chuẩn hóa tiêu đề
            if (title == null || title.trim().isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Title is required"); // Bắt buộc tiêu đề
            }

            String slug = ValidationUtils.normalize(input.getSlug()); // Chuẩn hóa slug
            if (slug == null || slug.trim().isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Slug is required"); // Bắt buộc slug
            }

            if (postRepo.existsBySlug(slug)) { // Trùng slug -> xung đột
                throw new ResponseStatusException(HttpStatus.CONFLICT, "Slug already exists");
            }

            // Validate authorId và categoryId
            ObjectId authorId = input.getAuthorId(); // Tác giả
            if (authorId == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Author ID is required");
            }
            if (!userRepo.existsById(authorId.toHexString())) { // Không tồn tại -> lỗi
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Author not found");
            }

            ObjectId categoryId = input.getCategoryId(); // Danh mục
            if (categoryId == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Category ID is required");
            }
            if (!categoryRepo.existsById(categoryId.toHexString())) { // Không tồn tại -> lỗi
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Category not found");
            }

            NewsPost post = NewsPost.builder()
                    .title(title) // Tiêu đề đã chuẩn hóa
                    .slug(slug) // Slug đã chuẩn hóa
                    .content(ValidationUtils.normalize(input.getContent())) // Nội dung chuẩn hóa
                    .thumbnailUrl(ValidationUtils.normalize(input.getThumbnailUrl())) // Ảnh đại diện
                    .authorId(authorId) // Tham chiếu tác giả
                    .categoryId(categoryId) // Tham chiếu danh mục
                    .isPublished(input.isPublished()) // Trạng thái publish
                    .publishedAt(input.isPublished() ? Instant.now() : null) // Thời điểm publish nếu có
                    .createdAt(Instant.now()) // Thời điểm tạo
                    .build();

            NewsPost savedPost = postRepo.save(post); // Lưu và nhận kết quả

            // Fallback populate nếu DocumentReference không hoạt động
            if (savedPost.getAuthor() == null && savedPost.getAuthorId() != null) {
                userRepo.findById(savedPost.getAuthorId().toHexString()).ifPresent(savedPost::setAuthor);
            }
            if (savedPost.getCategory() == null && savedPost.getCategoryId() != null) {
                categoryRepo.findById(savedPost.getCategoryId().toHexString()).ifPresent(savedPost::setCategory);
            }

            logger.info("News post created successfully: " + savedPost.getId()); // Log thành công
            return savedPost; // Trả về bài viết đã lưu

        } catch (ResponseStatusException e) {
            logger.warning("News post creation failed: " + e.getReason()); // Log cảnh báo nghiệp vụ
            throw e; // Ném lại để controller map HTTP code
        } catch (Exception e) {
            logger.severe("Unexpected error creating news post: " + e.getMessage()); // Lỗi hệ thống
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to create news post");
        }
    }

    /** Lấy danh sách bài viết. */
    public List<NewsPost> list(String title, Boolean published) {
        try {
            String keyword = ValidationUtils.normalize(title); // Từ khóa lọc tiêu đề
            List<NewsPost> posts;

            if (published != null && published) { // Chỉ lấy bài đã publish
                posts = keyword == null ? postRepo.findByIsPublishedTrue()
                        : postRepo.findByIsPublishedTrueAndTitleContainingIgnoreCase(keyword);
            } else { // Lấy tất cả
                posts = keyword == null ? postRepo.findAll() : postRepo.findByTitleContainingIgnoreCase(keyword);
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

            logger.info("Retrieved " + posts.size() + " news posts"); // Log số lượng
            return posts; // Trả về danh sách

        } catch (Exception e) {
            logger.severe("Error retrieving news posts: " + e.getMessage()); // Lỗi hệ thống
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to retrieve news posts");
        }
    }

    /** Lấy bài viết theo ID. */
    public NewsPost get(String id) {
        try {
            if (id == null || id.trim().isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Post ID is required"); // Thiếu id
            }

            NewsPost post = postRepo.findById(id)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "News post not found")); // Không
                                                                                                                  // thấy
                                                                                                                  // 404

            // Fallback populate nếu DocumentReference không hoạt động
            if (post.getAuthor() == null && post.getAuthorId() != null) {
                userRepo.findById(post.getAuthorId().toHexString()).ifPresent(post::setAuthor);
            }
            if (post.getCategory() == null && post.getCategoryId() != null) {
                categoryRepo.findById(post.getCategoryId().toHexString()).ifPresent(post::setCategory);
            }

            logger.info("Retrieved news post: " + post.getId()); // Log thành công
            return post; // Trả về bài viết

        } catch (ResponseStatusException e) {
            logger.warning("News post retrieval failed: " + e.getReason()); // Log cảnh báo
            throw e; // Ném lại cho controller
        } catch (Exception e) {
            logger.severe("Unexpected error retrieving news post: " + e.getMessage()); // Lỗi hệ thống
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to retrieve news post");
        }
    }

    /** Cập nhật bài viết. */
    public NewsPost update(String id, NewsPost input) {
        try {
            if (input == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Post data is required"); // Thiếu payload
            }

            NewsPost existingPost = get(id); // Lấy bản hiện có hoặc 404

            String title = ValidationUtils.normalize(input.getTitle()); // Chuẩn hóa tiêu đề
            if (title != null && !title.equals(existingPost.getTitle())) {
                existingPost.setTitle(title); // Cập nhật khi thay đổi
            }

            String slug = ValidationUtils.normalize(input.getSlug()); // Chuẩn hóa slug
            if (slug != null && !slug.equals(existingPost.getSlug())) {
                if (postRepo.existsBySlug(slug)) { // Trùng slug -> xung đột
                    throw new ResponseStatusException(HttpStatus.CONFLICT, "Slug already exists");
                }
                existingPost.setSlug(slug); // Cập nhật khi hợp lệ
            }

            String content = ValidationUtils.normalize(input.getContent()); // Chuẩn hóa nội dung
            if (content != null) {
                existingPost.setContent(content); // Cập nhật nội dung
            }

            String thumbnailUrl = ValidationUtils.normalize(input.getThumbnailUrl()); // Chuẩn hóa URL
            if (thumbnailUrl != null) {
                existingPost.setThumbnailUrl(thumbnailUrl); // Cập nhật ảnh đại diện
            }

            if (input.getAuthorId() != null) { // Cập nhật tác giả
                if (!userRepo.existsById(input.getAuthorId().toHexString())) { // Không tồn tại -> lỗi
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Author not found");
                }
                existingPost.setAuthorId(input.getAuthorId());
            }

            if (input.getCategoryId() != null) { // Cập nhật danh mục
                if (!categoryRepo.existsById(input.getCategoryId().toHexString())) { // Không tồn tại -> lỗi
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Category not found");
                }
                existingPost.setCategoryId(input.getCategoryId());
            }

            if (input.isPublished() != existingPost.isPublished()) { // Thay đổi trạng thái publish
                existingPost.setPublished(input.isPublished());
                if (input.isPublished() && existingPost.getPublishedAt() == null) {
                    existingPost.setPublishedAt(Instant.now()); // Gán thời điểm publish lần đầu
                }
            }

            existingPost.setUpdatedAt(Instant.now()); // Thời điểm cập nhật
            NewsPost updatedPost = postRepo.save(existingPost); // Lưu thay đổi

            logger.info("News post updated successfully: " + updatedPost.getId()); // Log thành công
            return updatedPost; // Trả về kết quả

        } catch (ResponseStatusException e) {
            logger.warning("News post update failed: " + e.getReason()); // Log cảnh báo
            throw e; // Ném lại cho controller
        } catch (Exception e) {
            logger.severe("Unexpected error updating news post: " + e.getMessage()); // Lỗi hệ thống
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to update news post");
        }
    }

    /** Xóa bài viết (soft delete). */
    public void delete(String id) {
        try {
            if (id == null || id.trim().isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Post ID is required"); // Thiếu id
            }

            NewsPost post = get(id); // Lấy bản hiện có
            post.setDeletedAt(Instant.now()); // Đánh dấu xóa mềm
            postRepo.save(post); // Lưu thay đổi

            logger.info("News post deleted successfully: " + id); // Log thành công

        } catch (ResponseStatusException e) {
            logger.warning("News post deletion failed: " + e.getReason()); // Log cảnh báo
            throw e; // Ném lại cho controller
        } catch (Exception e) {
            logger.severe("Unexpected error deleting news post: " + e.getMessage()); // Lỗi hệ thống
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to delete news post");
        }
    }
}

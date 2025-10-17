package com.example.spring_boot.controllers.modules.news;

import com.example.spring_boot.domains.news.NewsComment;
import com.example.spring_boot.dto.ApiResponse;
import com.example.spring_boot.services.news.NewsCommentService;
import com.example.spring_boot.dto.PageResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller cho NewsComment
 * Endpoints: /api/news-comments
 */
@RestController
@RequestMapping("/api/news-comments")
@Tag(name = "News Comment", description = "Quản lý bình luận bài viết")
public class NewsCommentController {
    private final NewsCommentService commentService;

    public NewsCommentController(NewsCommentService commentService) {
        this.commentService = commentService;
    }

    @PostMapping
    @Operation(summary = "Tạo bình luận mới", description = "Tạo bình luận mới cho bài viết, hỗ trợ bình luận lồng nhau")
    public ResponseEntity<ApiResponse<NewsComment>> create(@RequestBody NewsComment input) {
        NewsComment comment = commentService.create(input);
        return ResponseEntity.ok(ApiResponse.success(comment, "Comment created successfully"));
    }

    @GetMapping("/post/{postId}")
    @Operation(summary = "Lấy bình luận theo bài viết", description = "Lấy danh sách bình luận của một bài viết, sắp xếp theo thời gian tạo")
    public ResponseEntity<ApiResponse<PageResponse<NewsComment>>> getByPostId(
            @Parameter(description = "ID của bài viết") @PathVariable String postId) {
        List<NewsComment> comments = commentService.getByPostId(postId);
        PageResponse<NewsComment> payload = new PageResponse<>(comments, comments.size(), 0, 1000);
        return ResponseEntity.ok(ApiResponse.success(payload, "Comments retrieved successfully"));
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Lấy bình luận theo user", description = "Lấy danh sách bình luận của một user")
    public ResponseEntity<ApiResponse<PageResponse<NewsComment>>> getByUserId(
            @Parameter(description = "ID của user") @PathVariable String userId) {
        List<NewsComment> comments = commentService.getByUserId(userId);
        PageResponse<NewsComment> payload = new PageResponse<>(comments, comments.size(), 0, 1000);
        return ResponseEntity.ok(ApiResponse.success(payload, "Comments retrieved successfully"));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Lấy bình luận theo ID", description = "Lấy thông tin chi tiết bình luận theo ID")
    public ResponseEntity<ApiResponse<NewsComment>> get(
            @Parameter(description = "ID của bình luận") @PathVariable String id) {
        NewsComment comment = commentService.get(id);
        return ResponseEntity.ok(ApiResponse.success(comment, "Comment retrieved successfully"));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Cập nhật bình luận", description = "Cập nhật nội dung bình luận theo ID")
    public ResponseEntity<ApiResponse<NewsComment>> update(
            @Parameter(description = "ID của bình luận") @PathVariable String id,
            @RequestBody NewsComment input) {
        NewsComment comment = commentService.update(id, input);
        return ResponseEntity.ok(ApiResponse.success(comment, "Comment updated successfully"));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Xóa bình luận", description = "Xóa bình luận theo ID (soft delete)")
    public ResponseEntity<ApiResponse<Void>> delete(
            @Parameter(description = "ID của bình luận") @PathVariable String id) {
        commentService.delete(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Comment deleted successfully"));
    }
}

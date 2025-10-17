package com.example.spring_boot.controllers.modules.news;

import com.example.spring_boot.domains.news.NewsLike;
import com.example.spring_boot.dto.ApiResponse;
import com.example.spring_boot.services.news.NewsLikeService;
import com.example.spring_boot.dto.PageResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller cho NewsLike
 * Endpoints: /api/news-likes
 */
@RestController
@RequestMapping("/api/news-likes")
@Tag(name = "News Like", description = "Quản lý like bài viết")
public class NewsLikeController {
    private final NewsLikeService likeService;

    public NewsLikeController(NewsLikeService likeService) {
        this.likeService = likeService;
    }

    @PostMapping("/toggle")
    @Operation(summary = "Like/Unlike bài viết", description = "Toggle like/unlike cho bài viết. Nếu đã like thì unlike, chưa like thì like")
    public ResponseEntity<ApiResponse<NewsLike>> toggleLike(
            @Parameter(description = "ID của bài viết") @RequestParam String postId,
            @Parameter(description = "ID của user") @RequestParam String userId) {
        NewsLike like = likeService.toggleLike(postId, userId);
        return ResponseEntity.ok(ApiResponse.success(like, "Like toggled successfully"));
    }

    @GetMapping("/post/{postId}")
    @Operation(summary = "Lấy like theo bài viết", description = "Lấy danh sách like của một bài viết")
    public ResponseEntity<ApiResponse<PageResponse<NewsLike>>> getByPostId(
            @Parameter(description = "ID của bài viết") @PathVariable String postId) {
        List<NewsLike> likes = likeService.getByPostId(postId);
        PageResponse<NewsLike> payload = new PageResponse<>(likes, likes.size(), 0, 1000);
        return ResponseEntity.ok(ApiResponse.success(payload, "Likes retrieved successfully"));
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Lấy like theo user", description = "Lấy danh sách bài viết mà user đã like")
    public ResponseEntity<ApiResponse<PageResponse<NewsLike>>> getByUserId(
            @Parameter(description = "ID của user") @PathVariable String userId) {
        List<NewsLike> likes = likeService.getByUserId(userId);
        PageResponse<NewsLike> payload = new PageResponse<>(likes, likes.size(), 0, 1000);
        return ResponseEntity.ok(ApiResponse.success(payload, "Likes retrieved successfully"));
    }

    @GetMapping("/check")
    @Operation(summary = "Kiểm tra user đã like chưa", description = "Kiểm tra xem user đã like bài viết chưa")
    public ResponseEntity<ApiResponse<Boolean>> hasUserLiked(
            @Parameter(description = "ID của bài viết") @RequestParam String postId,
            @Parameter(description = "ID của user") @RequestParam String userId) {
        boolean hasLiked = likeService.hasUserLiked(postId, userId);
        return ResponseEntity.ok(ApiResponse.success(hasLiked, "Like status retrieved successfully"));
    }

    @GetMapping("/count/{postId}")
    @Operation(summary = "Đếm số like", description = "Đếm tổng số like của một bài viết")
    public ResponseEntity<ApiResponse<Long>> countLikes(
            @Parameter(description = "ID của bài viết") @PathVariable String postId) {
        long count = likeService.countLikes(postId);
        return ResponseEntity.ok(ApiResponse.success(count, "Like count retrieved successfully"));
    }
}

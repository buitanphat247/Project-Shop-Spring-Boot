package com.example.spring_boot.controllers.modules.news;

import com.example.spring_boot.domains.news.NewsPost;
import com.example.spring_boot.dto.ApiResponse;
import com.example.spring_boot.services.news.NewsPostService;
import com.example.spring_boot.dto.PageResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller cho NewsPost
 * Endpoints: /api/news-posts
 */
@RestController
@RequestMapping("/api/news-posts")
@Tag(name = "News Post", description = "Quản lý bài viết tin tức")
public class NewsPostController {
    private final NewsPostService postService;

    public NewsPostController(NewsPostService postService) {
        this.postService = postService;
    }

    @PostMapping
    @Operation(summary = "Tạo bài viết mới", description = "Tạo bài viết tin tức mới với tiêu đề, nội dung, tác giả và danh mục")
    public ResponseEntity<ApiResponse<NewsPost>> create(@RequestBody NewsPost input) {
        NewsPost post = postService.create(input);
        return ResponseEntity.ok(ApiResponse.success(post, "Post created successfully"));
    }

    @GetMapping
    @Operation(summary = "Lấy danh sách bài viết", description = "Lấy danh sách bài viết, có thể lọc theo tiêu đề và trạng thái publish")
    public ResponseEntity<ApiResponse<PageResponse<NewsPost>>> list(
            @Parameter(description = "Từ khóa tìm kiếm theo tiêu đề") @RequestParam(required = false) String title,
            @Parameter(description = "Lọc theo trạng thái publish (true/false)") @RequestParam(required = false) Boolean published) {
        List<NewsPost> posts = postService.list(title, published);
        PageResponse<NewsPost> payload = new PageResponse<>(posts, posts.size(), 0, 1000);
        return ResponseEntity.ok(ApiResponse.success(payload, "Posts retrieved successfully"));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Lấy bài viết theo ID", description = "Lấy thông tin chi tiết bài viết theo ID")
    public ResponseEntity<ApiResponse<NewsPost>> get(
            @Parameter(description = "ID của bài viết") @PathVariable String id) {
        NewsPost post = postService.get(id);
        return ResponseEntity.ok(ApiResponse.success(post, "Post retrieved successfully"));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Cập nhật bài viết", description = "Cập nhật thông tin bài viết theo ID")
    public ResponseEntity<ApiResponse<NewsPost>> update(
            @Parameter(description = "ID của bài viết") @PathVariable String id,
            @RequestBody NewsPost input) {
        NewsPost post = postService.update(id, input);
        return ResponseEntity.ok(ApiResponse.success(post, "Post updated successfully"));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Xóa bài viết", description = "Xóa bài viết theo ID (soft delete)")
    public ResponseEntity<ApiResponse<Void>> delete(
            @Parameter(description = "ID của bài viết") @PathVariable String id) {
        postService.delete(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Post deleted successfully"));
    }
}

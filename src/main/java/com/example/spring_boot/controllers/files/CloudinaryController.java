package com.example.spring_boot.controllers.files;

import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.spring_boot.dto.ApiResponse;
import com.example.spring_boot.services.CloudinaryService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/cloudinary")
@RequiredArgsConstructor
@Tag(name = "Cloudinary", description = "Upload và quản lý ảnh trên Cloudinary")
@Slf4j
public class CloudinaryController {

    private final CloudinaryService cloudinaryService;

    @PostMapping
    @Operation(summary = "Upload ảnh - Tối ưu hóa tốc độ")
    public ResponseEntity<ApiResponse<Map<String, Object>>> uploadImage(@RequestParam("image") MultipartFile file) {
        long startTime = System.currentTimeMillis();
        log.info("🚀 [UPLOAD] Starting upload for file: {} ({} bytes)", 
                file.getOriginalFilename(), file.getSize());
        
        try {
            // Validation nhanh
            if (file.isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(ApiResponse.fail("File không được để trống"));
            }
            
            // Kiểm tra kích thước file (max 10MB)
            if (file.getSize() > 10 * 1024 * 1024) {
                return ResponseEntity.badRequest()
                    .body(ApiResponse.fail("File quá lớn (tối đa 10MB)"));
            }
            
            // Kiểm tra loại file
            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                return ResponseEntity.badRequest()
                    .body(ApiResponse.fail("Chỉ chấp nhận file ảnh"));
            }
            
            Map<String, Object> data = this.cloudinaryService.upload(file);
            
            long endTime = System.currentTimeMillis();
            log.info("✅ [UPLOAD] Upload completed in {}ms for file: {}", 
                    endTime - startTime, file.getOriginalFilename());
            
            ApiResponse<Map<String, Object>> response = new ApiResponse<>(
                true, 
                "Ảnh đã được upload thành công", 
                data
            );
            return new ResponseEntity<>(response, HttpStatus.OK);
            
        } catch (Exception e) {
            long endTime = System.currentTimeMillis();
            log.error("❌ [UPLOAD] Upload failed after {}ms: {}", 
                    endTime - startTime, e.getMessage(), e);
            
            ApiResponse<Map<String, Object>> response = new ApiResponse<>(
                false, 
                "Lỗi khi upload ảnh: " + e.getMessage(), 
                null
            );
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @PostMapping("/async")
    @Operation(summary = "Upload ảnh bất đồng bộ - Tốc độ cao")
    public CompletableFuture<ResponseEntity<ApiResponse<Map<String, Object>>>> uploadImageAsync(
            @RequestParam("image") MultipartFile file) {
        
        long startTime = System.currentTimeMillis();
        log.info("🚀 [ASYNC UPLOAD] Starting async upload for file: {} ({} bytes)", 
                file.getOriginalFilename(), file.getSize());
        
        return cloudinaryService.uploadAsync(file)
            .thenApply(data -> {
                long endTime = System.currentTimeMillis();
                log.info("✅ [ASYNC UPLOAD] Upload completed in {}ms for file: {}", 
                        endTime - startTime, file.getOriginalFilename());
                
                ApiResponse<Map<String, Object>> response = new ApiResponse<>(
                    true, 
                    "Ảnh đã được upload thành công (async)", 
                    data
                );
                return new ResponseEntity<>(response, HttpStatus.OK);
            })
            .exceptionally(throwable -> {
                long endTime = System.currentTimeMillis();
                log.error("❌ [ASYNC UPLOAD] Upload failed after {}ms: {}", 
                        endTime - startTime, throwable.getMessage(), throwable);
                
                ApiResponse<Map<String, Object>> response = new ApiResponse<>(
                    false, 
                    "Lỗi khi upload ảnh (async): " + throwable.getMessage(), 
                    null
                );
                return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
            });
    }

    @PostMapping("/multiple")
    @Operation(summary = "Upload nhiều ảnh cùng lúc - Tốc độ cao")
    public CompletableFuture<ResponseEntity<ApiResponse<List<Map<String, Object>>>>> uploadMultipleImages(
            @RequestParam("images") MultipartFile[] files) {
        
        long startTime = System.currentTimeMillis();
        log.info("🚀 [MULTI UPLOAD] Starting upload for {} files", files.length);
        
        try {
            // Validation
            if (files.length == 0) {
                return CompletableFuture.completedFuture(
                    ResponseEntity.badRequest()
                        .body(ApiResponse.fail("Không có file nào được chọn"))
                );
            }
            
            if (files.length > 10) {
                return CompletableFuture.completedFuture(
                    ResponseEntity.badRequest()
                        .body(ApiResponse.fail("Tối đa 10 file mỗi lần upload"))
                );
            }
            
            // Upload tất cả files song song
            List<CompletableFuture<Map<String, Object>>> uploadFutures = 
                java.util.Arrays.stream(files)
                    .map(cloudinaryService::uploadAsync)
                    .collect(java.util.stream.Collectors.toList());
            
            // Chờ tất cả uploads hoàn thành
            return CompletableFuture.allOf(uploadFutures.toArray(new CompletableFuture[0]))
                .thenApply(v -> {
                    List<Map<String, Object>> results = uploadFutures.stream()
                        .map(CompletableFuture::join)
                        .collect(java.util.stream.Collectors.toList());
                    
                    long endTime = System.currentTimeMillis();
                    log.info("✅ [MULTI UPLOAD] Uploaded {} files in {}ms", 
                            results.size(), endTime - startTime);
                    
                    ApiResponse<List<Map<String, Object>>> response = new ApiResponse<>(
                        true, 
                        "Đã upload thành công " + results.size() + " ảnh", 
                        results
                    );
                    return new ResponseEntity<>(response, HttpStatus.OK);
                })
                .exceptionally(throwable -> {
                    long endTime = System.currentTimeMillis();
                    log.error("❌ [MULTI UPLOAD] Upload failed after {}ms: {}", 
                            endTime - startTime, throwable.getMessage(), throwable);
                    
                    ApiResponse<List<Map<String, Object>>> response = new ApiResponse<>(
                        false, 
                        "Lỗi khi upload nhiều ảnh: " + throwable.getMessage(), 
                        null
                    );
                    return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
                });
                
        } catch (Exception e) {
            long endTime = System.currentTimeMillis();
            log.error("❌ [MULTI UPLOAD] Upload failed after {}ms: {}", 
                    endTime - startTime, e.getMessage(), e);
            
            ApiResponse<List<Map<String, Object>>> response = new ApiResponse<>(
                false, 
                "Lỗi khi upload nhiều ảnh: " + e.getMessage(), 
                null
            );
            return CompletableFuture.completedFuture(
                new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR)
            );
        }
    }

    @GetMapping("/images/{folder}")
    @Operation(summary = "Danh sách ảnh theo folder")
    public ResponseEntity<?> getImages(@PathVariable String folder) {
        try {
            List<Map<String, Object>> images = cloudinaryService.getImagesInFolder(folder);
            return ResponseEntity.ok(images);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }
}
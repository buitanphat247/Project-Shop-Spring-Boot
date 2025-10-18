package com.example.spring_boot.services;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Executor;
import java.util.concurrent.Executors;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class CloudinaryService {

    private final Cloudinary cloudinary;
    
    // Thread pool cho async upload
    private final Executor uploadExecutor = Executors.newFixedThreadPool(10);

    @SuppressWarnings("unchecked")
    public Map<String, Object> upload(MultipartFile file) {
        long startTime = System.currentTimeMillis();
        log.info("🚀 [CLOUDINARY] Starting upload for file: {} ({} bytes)", 
                file.getOriginalFilename(), file.getSize());
        
        try {
            // Tối ưu hóa upload parameters - đơn giản hóa để tránh lỗi
            Map<String, Object> uploadOptions = ObjectUtils.asMap(
                    "folder", "spring_shop",
                    "resource_type", "auto",
                    "quality", "auto:good",
                    "fetch_format", "auto",
                    "flags", "progressive"
            );
            
            Map<String, Object> result = (Map<String, Object>) this.cloudinary.uploader()
                    .upload(file.getBytes(), uploadOptions);
            
            long endTime = System.currentTimeMillis();
            log.info("✅ [CLOUDINARY] Upload completed in {}ms for file: {}", 
                    endTime - startTime, file.getOriginalFilename());
            
            return result;
            
        } catch (IOException io) {
            long endTime = System.currentTimeMillis();
            log.error("❌ [CLOUDINARY] Upload failed after {}ms: {}", 
                    endTime - startTime, io.getMessage());
            throw new RuntimeException("Image upload failed", io);
        }
    }
    
    // Async upload method
    public CompletableFuture<Map<String, Object>> uploadAsync(MultipartFile file) {
        return CompletableFuture.supplyAsync(() -> upload(file), uploadExecutor);
    }

    // Upload với compression tối ưu
    @SuppressWarnings("unchecked")
    public Map<String, Object> uploadCompressed(MultipartFile file) {
        long startTime = System.currentTimeMillis();
        log.info("🗜️ [COMPRESSED UPLOAD] Starting compressed upload for file: {} ({} bytes)", 
                file.getOriginalFilename(), file.getSize());
        
        try {
            Map<String, Object> uploadOptions = ObjectUtils.asMap(
                    "folder", "spring_shop",
                    "resource_type", "auto",
                    "quality", "auto:low",
                    "fetch_format", "auto",
                    "flags", "progressive",
                    "width", 800,
                    "height", 600,
                    "crop", "limit"
            );
            
            Map<String, Object> result = (Map<String, Object>) this.cloudinary.uploader()
                    .upload(file.getBytes(), uploadOptions);
            
            long endTime = System.currentTimeMillis();
            log.info("✅ [COMPRESSED UPLOAD] Upload completed in {}ms for file: {}", 
                    endTime - startTime, file.getOriginalFilename());
            
            return result;
            
        } catch (IOException io) {
            long endTime = System.currentTimeMillis();
            log.error("❌ [COMPRESSED UPLOAD] Upload failed after {}ms: {}", 
                    endTime - startTime, io.getMessage());
            throw new RuntimeException("Compressed image upload failed", io);
        }
    }
    
    // Upload với quality cao
    @SuppressWarnings("unchecked")
    public Map<String, Object> uploadHighQuality(MultipartFile file) {
        long startTime = System.currentTimeMillis();
        log.info("🎨 [HQ UPLOAD] Starting high quality upload for file: {} ({} bytes)", 
                file.getOriginalFilename(), file.getSize());
        
        try {
            Map<String, Object> uploadOptions = ObjectUtils.asMap(
                    "folder", "spring_shop",
                    "resource_type", "auto",
                    "quality", "auto:best",
                    "fetch_format", "auto",
                    "flags", "progressive",
                    "width", 2560,
                    "height", 1440,
                    "crop", "limit"
            );
            
            Map<String, Object> result = (Map<String, Object>) this.cloudinary.uploader()
                    .upload(file.getBytes(), uploadOptions);
            
            long endTime = System.currentTimeMillis();
            log.info("✅ [HQ UPLOAD] Upload completed in {}ms for file: {}", 
                    endTime - startTime, file.getOriginalFilename());
            
            return result;
            
        } catch (IOException io) {
            long endTime = System.currentTimeMillis();
            log.error("❌ [HQ UPLOAD] Upload failed after {}ms: {}", 
                    endTime - startTime, io.getMessage());
            throw new RuntimeException("High quality image upload failed", io);
        }
    }

    @SuppressWarnings("unchecked")
    public List<Map<String, Object>> getImagesInFolder(String folderName) throws Exception {
        long startTime = System.currentTimeMillis();
        log.info("📁 [FOLDER] Getting images from folder: {}", folderName);
        
        try {
            com.cloudinary.api.ApiResponse response = cloudinary.api().resources(ObjectUtils.asMap(
                    "type", "upload",
                    "prefix", folderName + "/",
                    "max_results", 100,
                    "sort_by", ObjectUtils.asMap("created_at", "desc")
            ));

            // Fix casting issue - check if resources is actually a List
            Object resourcesObj = response.get("resources");
            List<Map<String, Object>> images;
            
            if (resourcesObj instanceof List) {
                images = (List<Map<String, Object>>) resourcesObj;
            } else {
                log.warn("⚠️ [FOLDER] Resources is not a List, type: {}", resourcesObj.getClass().getSimpleName());
                images = new java.util.ArrayList<>();
            }
            
            long endTime = System.currentTimeMillis();
            log.info("✅ [FOLDER] Retrieved {} images in {}ms", 
                    images.size(), endTime - startTime);
            
            return images;
            
        } catch (Exception e) {
            long endTime = System.currentTimeMillis();
            log.error("❌ [FOLDER] Failed to get images after {}ms: {}", 
                    endTime - startTime, e.getMessage());
            throw e;
        }
    }
}
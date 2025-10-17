package com.example.spring_boot.controllers.files;

import java.util.List;
import java.util.Map;

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

import com.example.spring_boot.services.CloudinaryService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/cloudinary")
@RequiredArgsConstructor
@Tag(name = "Cloudinary", description = "Upload và quản lý ảnh trên Cloudinary")
public class CloudinaryController {

    private final CloudinaryService cloudinaryService;

    @PostMapping
    @Operation(summary = "Upload ảnh")
    public ResponseEntity<Map<String, Object>> uploadImage(@RequestParam("image") MultipartFile file) {
        Map<String, Object> data = this.cloudinaryService.upload(file);
        return new ResponseEntity<>(data, HttpStatus.OK);
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
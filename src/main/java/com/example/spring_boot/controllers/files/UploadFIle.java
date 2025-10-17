package com.example.spring_boot.controllers.files;

import com.example.spring_boot.dto.ApiResponse;
import com.example.spring_boot.configs.UploadProperties;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@Tag(name = "File Upload", description = "APIs for uploading files to server")
public class UploadFIle {
    private final UploadProperties uploadProperties;

    @PostMapping("/uploadFile")
    @Operation(summary = "Upload single file", description = "Form-Data: key 'file' (type: file). Trả về ApiResponse chứa thông tin file đã lưu (originalName, savedName, size, contentType, path)")
    public ApiResponse<Map<String, Object>> submit(@RequestParam("file") MultipartFile file) {
        Map<String, Object> data = new HashMap<>();
        if (file == null || file.isEmpty()) {
            return ApiResponse.fail("No file uploaded");
        }
        try {
            String originalName = file.getOriginalFilename();
            String ext = (originalName != null && originalName.contains("."))
                    ? originalName.substring(originalName.lastIndexOf('.'))
                    : "";
            String safeName = UUID.randomUUID() + ext;

            Path uploadDir = Paths.get(uploadProperties.getDir());
            if (!Files.exists(uploadDir)) {
                Files.createDirectories(uploadDir);
            }

            Path target = uploadDir.resolve(safeName).normalize();
            Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);

            data.put("originalName", originalName);
            data.put("savedName", safeName);
            data.put("size", file.getSize());
            data.put("contentType", file.getContentType());
            data.put("path", target.toAbsolutePath().toString());
            return ApiResponse.success(data, "File uploaded successfully");
        } catch (IOException e) {
            return ApiResponse.fail("Failed to save file: " + e.getMessage());
        }
    }
}
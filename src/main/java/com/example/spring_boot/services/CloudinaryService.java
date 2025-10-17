package com.example.spring_boot.services;

import java.io.IOException;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;

import lombok.RequiredArgsConstructor;
import java.util.List;
import com.cloudinary.api.ApiResponse;

@Service
@RequiredArgsConstructor
public class CloudinaryService {

    private final Cloudinary cloudinary;

    @SuppressWarnings("unchecked")
    public Map<String, Object> upload(MultipartFile file) {
        try {
            return (Map<String, Object>) this.cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap(
                    "folder", "spring_shop", // 👈 Thư mục lưu trữ
                    "resource_type", "auto" // Cho phép cả ảnh & video
            ));
        } catch (IOException io) {
            throw new RuntimeException("Image upload failed", io);
        }
    }

    @SuppressWarnings("unchecked") // 👈 hoặc thêm dòng này nếu muốn tắt cảnh báo compile-time
    public List<Map<String, Object>> getImagesInFolder(String folderName) throws Exception {
        ApiResponse response = cloudinary.api().resources(ObjectUtils.asMap(
                "type", "upload",
                "prefix", folderName + "/", // 👈 lấy tất cả ảnh bắt đầu với "folderName/"
                "max_results", 100 // số lượng tối đa trả về (tối đa 500)
        ));

        return (List<Map<String, Object>>) response.get("resources");
    }
}
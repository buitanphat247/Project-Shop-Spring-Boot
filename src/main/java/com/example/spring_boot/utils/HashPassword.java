package com.example.spring_boot.utils;

import org.springframework.stereotype.Component;

import java.security.MessageDigest;

/**
 * Tiện ích hash mật khẩu (MD5 đơn giản cho demo). Không dùng MD5 cho sản xuất.
 * Nên thay bằng BCrypt/Argon2 khi triển khai thực tế.
 */
@Component
public class HashPassword {
    /** Hash chuỗi bằng MD5 và trả hex lowercase */
    public String hashPasswordMD5(String input) {
        try {
            MessageDigest md = MessageDigest.getInstance("MD5");
            byte[] digest = md.digest(input.getBytes());
            StringBuilder sb = new StringBuilder();
            for (byte b : digest) sb.append(String.format("%02x", b));
            return sb.toString();
        } catch (Exception e) {
            throw new RuntimeException("Hash error: " + e.getMessage());
        }
    }
}



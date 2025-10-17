package com.example.spring_boot.utils;

/**
 * Tiện ích chuẩn hóa và validate chuỗi dùng chung giữa các service.
 */
public final class ValidationUtils {
    private ValidationUtils() {}

    /** Trim và chuyển chuỗi rỗng thành null */
    public static String normalize(String input) {
        if (input == null) return null;
        String s = input.trim();
        return s.isEmpty() ? null : s;
    }

    /** Validate tên bắt buộc và giới hạn độ dài */
    public static String validateName(String input, int maxLen) {
        String s = normalize(input);
        if (s == null) throw new IllegalArgumentException("name is required");
        if (s.length() > maxLen) throw new IllegalArgumentException("name too long (max " + maxLen + ")");
        return s;
    }
}



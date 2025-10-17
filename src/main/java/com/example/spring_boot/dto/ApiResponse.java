package com.example.spring_boot.dto;

/**
 * Wrapper chuẩn cho mọi API.
 * - success: trạng thái xử lý
 * - message: thông điệp (tùy chọn)
 * - data: payload trả về
 */
public class ApiResponse<T> {
    public boolean success;
    public String message;
    public T data;

    public ApiResponse() {
    }

    public ApiResponse(boolean success, String message, T data) {
        this.success = success;
        this.message = message;
        this.data = data;
    }

    /** Trả response thành công với payload */
    public static <T> ApiResponse<T> ok(T data) {
        return new ApiResponse<>(true, null, data);
    }

    /** Trả response thành công với message và data */
    public static <T> ApiResponse<T> success(T data, String message) {
        return new ApiResponse<>(true, message, data);
    }

    /** Trả response thất bại với message */
    public static <T> ApiResponse<T> fail(String msg) {
        return new ApiResponse<>(false, msg, null);
    }
}

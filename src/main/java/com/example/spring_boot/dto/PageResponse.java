package com.example.spring_boot.dto;

import java.util.List;

/**
 * Gói dữ liệu danh sách theo chuẩn: items + tổng + thông tin trang.
 * Không phụ thuộc Pageable để linh hoạt cho cả truy vấn thủ công.
 */
public class PageResponse<T> {
    public List<T> items;
    public long total;
    public int currentPage;
    public int totalPages;
    public int size;

    public PageResponse() {
    }

    public PageResponse(List<T> items, long total, int currentPage, int size) {
        this.items = items;
        this.total = total;
        this.currentPage = currentPage;
        this.size = size;
        this.totalPages = (int) Math.ceil((double) total / size);
    }
}

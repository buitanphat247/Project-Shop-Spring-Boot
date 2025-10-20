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
        // Fix: totalPages should be at least 1 if there are items, 0 if no items
        // Sử dụng Math.floor để làm tròn xuống, nhưng đảm bảo ít nhất 1 trang
        this.totalPages = total > 0 ? Math.max(1, (int) Math.floor((double) total / size)) : 0;
    }
}

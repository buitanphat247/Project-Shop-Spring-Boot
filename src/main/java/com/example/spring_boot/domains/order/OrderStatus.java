package com.example.spring_boot.domains.order;

/**
 * Enum cho trạng thái đơn hàng
 */
public enum OrderStatus {
    PENDING("Chờ xử lý"),
    PROCESSING("Đang xử lý"),
    SHIPPED("Đã giao hàng"),
    DELIVERED("Đã nhận hàng"),
    CANCELLED("Đã hủy"),
    RETURNED("Đã trả hàng");
    
    private final String description;
    
    OrderStatus(String description) {
        this.description = description;
    }
    
    public String getDescription() {
        return description;
    }
}

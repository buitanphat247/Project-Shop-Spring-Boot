package com.example.spring_boot.domains.order;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "orders")
public class Order {
    @Id
    private String id;
    
    @Field("user_id")
    private String userId;
    
    @Field("session_id")
    private String sessionId;
    
    @Field("order_number")
    private String orderNumber;
    
    private String username;
    private String phone;
    private String address;
    private String notes;
    
    private List<OrderItem> items;
    
    @Field("total_amount")
    private Double totalAmount;
    
    private String status; // pending, paid, shipped, delivered, cancelled
    
    @Field("payment_method")
    private String paymentMethod;
    
    @Field("payment_status")
    private String paymentStatus;
    
    @Field("payment_time")
    private LocalDateTime paymentTime;
    
    @Field("transaction_id")
    private String transactionId;
    
    @Field("created_at")
    private LocalDateTime createdAt;
    
    @Field("updated_at")
    private LocalDateTime updatedAt;
    
    // Constructors
    public Order() {
        this.items = new ArrayList<>();
        this.status = "pending";
        this.paymentStatus = "pending";
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
    public Order(String userId, String sessionId, String username, String phone, String address) {
        this();
        this.userId = userId;
        this.sessionId = sessionId;
        this.username = username;
        this.phone = phone;
        this.address = address;
        this.orderNumber = generateOrderNumber();
    }
    
    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    
    public String getSessionId() { return sessionId; }
    public void setSessionId(String sessionId) { this.sessionId = sessionId; }
    
    public String getOrderNumber() { return orderNumber; }
    public void setOrderNumber(String orderNumber) { this.orderNumber = orderNumber; }
    
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    
    public List<OrderItem> getItems() { return items; }
    public void setItems(List<OrderItem> items) { this.items = items; }
    
    public Double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(Double totalAmount) { this.totalAmount = totalAmount; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
    
    public String getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }
    
    public LocalDateTime getPaymentTime() { return paymentTime; }
    public void setPaymentTime(LocalDateTime paymentTime) { this.paymentTime = paymentTime; }
    
    public String getTransactionId() { return transactionId; }
    public void setTransactionId(String transactionId) { this.transactionId = transactionId; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    // Business methods
    public void addItem(OrderItem item) {
        items.add(item);
        calculateTotalAmount();
        this.updatedAt = LocalDateTime.now();
    }
    
    public void calculateTotalAmount() {
        this.totalAmount = items.stream()
                .mapToDouble(OrderItem::getTotalPrice)
                .sum();
    }
    
    public void updatePaymentInfo(String paymentMethod, String transactionId) {
        this.paymentMethod = paymentMethod;
        this.transactionId = transactionId;
        this.paymentStatus = "paid";
        this.paymentTime = LocalDateTime.now();
        this.status = "paid";
        this.updatedAt = LocalDateTime.now();
    }
    
    public void updateStatus(String status) {
        this.status = status;
        this.updatedAt = LocalDateTime.now();
    }
    
    public boolean isPaid() {
        return "paid".equals(paymentStatus);
    }
    
    public boolean isPending() {
        return "pending".equals(status);
    }
    
    private String generateOrderNumber() {
        return "ORD" + System.currentTimeMillis() + String.format("%04d", (int)(Math.random() * 10000));
    }
}

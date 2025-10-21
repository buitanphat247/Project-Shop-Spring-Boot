package com.example.spring_boot.domains.orders;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.DocumentReference;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "orders")
public class Order {
    
    @Id
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String id;
    
    @Field("user_id")
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String userId;
    
    @Field("total_amount")
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private BigDecimal totalAmount;
    
    @Field("status")
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @Builder.Default
    private String status = "pending";
    
    @Field("address")
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String address;
    
    @Field("payment_method")
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String paymentMethod;
    
    @Field("created_at")
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @Builder.Default
    private Instant createdAt = Instant.now();
    
    @Field("updated_at")
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private Instant updatedAt;
    
    @Field("deleted_at")
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private Instant deletedAt;
    
    // OrderItems sẽ được lưu riêng trong collection order_items
    // Không cần embedded field này nữa
}

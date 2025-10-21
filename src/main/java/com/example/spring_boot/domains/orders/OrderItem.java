package com.example.spring_boot.domains.orders;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.math.BigDecimal;
import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "order_items")
public class OrderItem {
    
    @Id
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String id;
    
    @Field("order_id")
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String orderId;
    
    @Field("product_id")
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String productId;
    
    @Field("quantity")
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private Integer quantity;
    
    @Field("price")
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private BigDecimal price;
    
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
}

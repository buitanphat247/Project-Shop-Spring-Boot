package com.example.spring_boot.domains.products;

import lombok.*;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DocumentReference;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.FieldType;

import com.example.spring_boot.domains.User;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "product_likes")
public class ProductLike {
    @Id
    private String id;

    @Field(targetType = FieldType.OBJECT_ID)
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private ObjectId productId;

    @Field(targetType = FieldType.OBJECT_ID)
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private ObjectId userId;

    @DocumentReference(lookup = "{ '_id' : ?#{#target.productId} }")
    private Product product;
    
    @DocumentReference(lookup = "{ '_id' : ?#{#target.userId} }")
    private User user;

    @Builder.Default
    private Instant createdAt = Instant.now();
    private Instant deletedAt;
}

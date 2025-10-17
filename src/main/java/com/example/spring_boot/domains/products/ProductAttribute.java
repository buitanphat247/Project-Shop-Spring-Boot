package com.example.spring_boot.domains.products;

import lombok.*;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DocumentReference;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.FieldType;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "product_attributes")
public class ProductAttribute {
    @Id
    private String id;

    @Field(targetType = FieldType.OBJECT_ID)
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private ObjectId productId;

    @DocumentReference(lookup = "{ '_id' : ?#{#target.productId} }")
    private Product product;

    private String name;
    private String value;

    @Builder.Default
    private Instant createdAt = Instant.now();
    private Instant deletedAt;
}

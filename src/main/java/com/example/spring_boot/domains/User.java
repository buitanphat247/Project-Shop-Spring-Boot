package com.example.spring_boot.domains;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.FieldType;
import com.fasterxml.jackson.annotation.JsonIgnore;
import org.springframework.data.mongodb.core.mapping.DocumentReference;
import org.bson.types.ObjectId;
import java.time.Instant;

/** User embed role snapshot để truy vấn nhanh */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "users")
public class User {
    @Id
    private String id;
    private String name;
    private String email;
    private String password;
    private String phone;
    private String address;
    private String refreshToken;

    // Lưu roleId dưới dạng ObjectId thực sự
    @Field(targetType = FieldType.OBJECT_ID)
    @JsonIgnore
    private ObjectId roleId;

    @Builder.Default
    private Instant createdAt = Instant.now();
    private Instant updatedAt;
    private Instant deletedAt;

    // Tự populate Role theo roleId khi đọc ra (ít code nhất)
    @DocumentReference(lookup = "{ '_id' : ?#{#target.roleId} }")
    private Role role;

}

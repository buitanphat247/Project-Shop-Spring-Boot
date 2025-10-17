package com.example.spring_boot.domains.news;

import lombok.*;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.FieldType;

import com.example.spring_boot.domains.User;

import org.springframework.data.mongodb.core.mapping.DocumentReference;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "news_comments")
public class NewsComment {
    @Id
    private String id;

    @Field(targetType = FieldType.OBJECT_ID)
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private ObjectId postId;
    @Field(targetType = FieldType.OBJECT_ID)
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private ObjectId userId;
    private String content;
    @Field(targetType = FieldType.OBJECT_ID)
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private ObjectId parentId;

    @DocumentReference(lookup = "{ '_id' : ?#{#target.postId} }")
    private NewsPost post;
    @DocumentReference(lookup = "{ '_id' : ?#{#target.userId} }")
    private User user;
    @DocumentReference(lookup = "{ '_id' : ?#{#target.parentId} }")
    private NewsComment parent;

    @Builder.Default
    private Instant createdAt = Instant.now();
    private Instant updatedAt;
    private Instant deletedAt;
}

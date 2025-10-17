package com.example.spring_boot.domains.news;

import lombok.*;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.FieldType;

import com.example.spring_boot.domains.User;
import com.fasterxml.jackson.annotation.JsonProperty;

import org.springframework.data.mongodb.core.mapping.DocumentReference;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "news_posts")
public class NewsPost {
    @Id
    private String id;
    private String title;
    @Indexed(unique = true)
    private String slug;
    private String content;
    private String thumbnailUrl;

    @Field(targetType = FieldType.OBJECT_ID)
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private ObjectId authorId;
    @Field(targetType = FieldType.OBJECT_ID)
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private ObjectId categoryId;

    @DocumentReference(lookup = "{ '_id' : ?#{#target.authorId} }")
    private User author;
    @DocumentReference(lookup = "{ '_id' : ?#{#target.categoryId} }")
    private NewsCategory category;

    @Builder.Default
    private boolean isPublished = false;
    private Instant publishedAt;

    @Builder.Default
    private Instant createdAt = Instant.now();
    private Instant updatedAt;
    private Instant deletedAt;
}

package com.example.spring_boot.domains;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "roles")
public class Role {
    @Id
    private String id;

    @Indexed(unique = true)
    private String name;

    private String description;

    @Builder.Default
    private Instant createdAt = Instant.now();
    private Instant updatedAt;
    private Instant deletedAt;
}

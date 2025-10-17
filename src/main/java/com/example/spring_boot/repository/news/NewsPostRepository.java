package com.example.spring_boot.repository.news;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.example.spring_boot.domains.news.NewsPost;

import java.util.List;
import java.util.Optional;

@Repository
public interface NewsPostRepository extends MongoRepository<NewsPost, String> {
    boolean existsBySlug(String slug);
    Optional<NewsPost> findBySlug(String slug);
    List<NewsPost> findByTitleContainingIgnoreCase(String keyword);
    List<NewsPost> findByAuthorId(ObjectId authorId);
    List<NewsPost> findByCategoryId(ObjectId categoryId);
    List<NewsPost> findByIsPublishedTrue();
    List<NewsPost> findByIsPublishedTrueAndTitleContainingIgnoreCase(String keyword);
}

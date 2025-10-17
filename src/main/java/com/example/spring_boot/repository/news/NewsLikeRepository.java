package com.example.spring_boot.repository.news;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.example.spring_boot.domains.news.NewsLike;

import java.util.List;
import java.util.Optional;

@Repository
public interface NewsLikeRepository extends MongoRepository<NewsLike, String> {
    List<NewsLike> findByPostId(ObjectId postId);
    List<NewsLike> findByUserId(ObjectId userId);
    Optional<NewsLike> findByPostIdAndUserId(ObjectId postId, ObjectId userId);
    boolean existsByPostIdAndUserId(ObjectId postId, ObjectId userId);
    long countByPostId(ObjectId postId);
}

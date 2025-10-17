package com.example.spring_boot.repository.news;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.example.spring_boot.domains.news.NewsComment;

import java.util.List;

@Repository
public interface NewsCommentRepository extends MongoRepository<NewsComment, String> {
    List<NewsComment> findByPostIdOrderByCreatedAtDesc(ObjectId postId);
    List<NewsComment> findByUserIdOrderByCreatedAtDesc(ObjectId userId);
    List<NewsComment> findByParentIdOrderByCreatedAtDesc(ObjectId parentId);
    List<NewsComment> findByPostIdAndParentIdIsNullOrderByCreatedAtDesc(ObjectId postId);
    long countByPostId(ObjectId postId);
    boolean existsByPostIdAndUserId(ObjectId postId, ObjectId userId);
}

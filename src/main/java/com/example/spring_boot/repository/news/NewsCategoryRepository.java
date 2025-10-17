package com.example.spring_boot.repository.news;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.example.spring_boot.domains.news.NewsCategory;

import java.util.List;
import java.util.Optional;

@Repository
public interface NewsCategoryRepository extends MongoRepository<NewsCategory, String> {
    boolean existsByName(String name);
    Optional<NewsCategory> findByName(String name);
    List<NewsCategory> findByNameContainingIgnoreCase(String keyword);
}

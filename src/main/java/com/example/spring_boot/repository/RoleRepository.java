package com.example.spring_boot.repository;

import com.example.spring_boot.domains.Role;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RoleRepository extends MongoRepository<Role, String> {
    boolean existsByName(String name);
    List<Role> findByNameContainingIgnoreCase(String keyword);
    Optional<Role> findByName(String name);
}



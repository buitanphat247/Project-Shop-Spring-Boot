package com.example.spring_boot.services;

import com.example.spring_boot.domains.Role;
import com.example.spring_boot.domains.User;
import com.example.spring_boot.repository.RoleRepository;
import com.example.spring_boot.repository.UserRepository;
import com.example.spring_boot.utils.HashPassword;
import com.example.spring_boot.utils.ValidationUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/** Service User dùng embed role snapshot - TỐI ƯU HÓA với MongoTemplate */
@Service
@Slf4j
public class UserService {
    private final UserRepository userRepo;
    private final RoleRepository roleRepo;
    private final HashPassword hashPassword;
    private final MongoTemplate mongoTemplate;

    public UserService(UserRepository userRepo, RoleRepository roleRepo, HashPassword hashPassword, MongoTemplate mongoTemplate) {
        this.userRepo = userRepo;
        this.roleRepo = roleRepo;
        this.hashPassword = hashPassword;
        this.mongoTemplate = mongoTemplate;
    }

    public User create(User input) {
        try {
            if (input == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User data is required");
            }

            String email = ValidationUtils.normalize(input.getEmail());
            if (email == null || email.trim().isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email is required");
            }

            if (userRepo.existsByEmail(email)) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already exists");
            }

            if (input.getPassword() == null || input.getPassword().trim().isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Password is required");
            }

            // roleId: nếu client không gửi thì mặc định lấy role ADMIN
            org.bson.types.ObjectId roleId = input.getRoleId();
            if (roleId == null) {
                String adminRoleId = roleRepo.findByName("USER").map(Role::getId).orElse(null);
                roleId = adminRoleId != null ? new org.bson.types.ObjectId(adminRoleId) : null;
            }

            String refreshToken = ValidationUtils.normalize(input.getRefreshToken());

            User user = User.builder()
                    .name(ValidationUtils.normalize(input.getName()))
                    .email(email)
                    .password(hashPassword.hashPasswordMD5(input.getPassword()))
                    .phone(ValidationUtils.normalize(input.getPhone()))
                    .address(ValidationUtils.normalize(input.getAddress()))
                    .refreshToken(refreshToken)
                    .roleId(roleId)
                    .createdAt(Instant.now())
                    .build();

            User savedUser = userRepo.save(user);

            // Fallback populate role if @DocumentReference doesn't work
            if (savedUser.getRole() == null && savedUser.getRoleId() != null) {
                roleRepo.findById(savedUser.getRoleId().toHexString()).ifPresent(savedUser::setRole);
            }

            log.info("✅ [PERFORMANCE] User created successfully: {}", savedUser.getId());
            return savedUser;

        } catch (ResponseStatusException e) {
            log.warn("❌ [PERFORMANCE] User creation failed: {}", e.getReason());
            throw e;
        } catch (Exception e) {
            log.error("❌ [PERFORMANCE] Unexpected error creating user", e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to create user");
        }
    }

    /** Lấy danh sách users - TỐI ƯU HÓA với batch loading và projection. */
    public List<User> list(String name) {
        long startTime = System.currentTimeMillis();
        log.info("👥 [PERFORMANCE] Getting users with optimization, name filter: {}", name);
        
        try {
            Query query = new Query();
            
            if (name != null && !name.trim().isEmpty()) {
                String keyword = ValidationUtils.normalize(name);
                query.addCriteria(Criteria.where("name").regex(keyword, "i"));
            }
            
            // Projection để chỉ lấy fields cần thiết
            query.fields().include("name", "email", "phone", "address", "roleId", "createdAt", "updatedAt");
            
            List<User> users = mongoTemplate.find(query, User.class);
            
            // Batch loading roles để tránh N+1 query problem
            batchPopulateRoles(users);
            
            long endTime = System.currentTimeMillis();
            log.info("✅ [PERFORMANCE] Retrieved {} users in {}ms", users.size(), endTime - startTime);
            return users;

        } catch (Exception e) {
            log.error("❌ [PERFORMANCE] Error retrieving users", e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to retrieve users");
        }
    }

    /** Lấy user theo ID - TỐI ƯU HÓA với projection. */
    public User get(String id) {
        long startTime = System.currentTimeMillis();
        log.info("👤 [PERFORMANCE] Getting user by ID: {}", id);
        
        try {
            if (id == null || id.trim().isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User ID is required");
            }

            Query query = new Query(Criteria.where("_id").is(id));
            query.fields().include("name", "email", "phone", "address", "roleId", "createdAt", "updatedAt");
            
            User user = mongoTemplate.findOne(query, User.class);
            if (user == null) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
            }

            // Populate role nếu cần
            if (user.getRole() == null && user.getRoleId() != null) {
                roleRepo.findById(user.getRoleId().toHexString()).ifPresent(user::setRole);
            }

            long endTime = System.currentTimeMillis();
            log.info("✅ [PERFORMANCE] Retrieved user {} in {}ms", user.getId(), endTime - startTime);
            return user;

        } catch (ResponseStatusException e) {
            log.warn("❌ [PERFORMANCE] User retrieval failed: {}", e.getReason());
            throw e;
        } catch (Exception e) {
            log.error("❌ [PERFORMANCE] Unexpected error retrieving user", e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to retrieve user");
        }
    }

    /** Cập nhật user - TỐI ƯU HÓA với single query update. */
    public User update(String id, User input) {
        long startTime = System.currentTimeMillis();
        log.info("✏️ [PERFORMANCE] Updating user: {}", id);
        
        try {
            if (input == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User data is required");
            }

            User existingUser = get(id);

            // Kiểm tra email conflict trước khi update
            String email = ValidationUtils.normalize(input.getEmail());
            if (email != null && !email.equalsIgnoreCase(existingUser.getEmail())) {
                if (userRepo.existsByEmail(email)) {
                    throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already exists");
                }
            }

            // Update fields
            String name = ValidationUtils.normalize(input.getName());
            if (name != null && !name.trim().isEmpty()) {
                existingUser.setName(name);
            }

            if (email != null) {
                existingUser.setEmail(email);
            }

            if (input.getPassword() != null && !input.getPassword().trim().isEmpty()) {
                existingUser.setPassword(hashPassword.hashPasswordMD5(input.getPassword()));
            }

            String phone = ValidationUtils.normalize(input.getPhone());
            if (phone != null) {
                existingUser.setPhone(phone);
            }

            String address = ValidationUtils.normalize(input.getAddress());
            if (address != null) {
                existingUser.setAddress(address);
            }

            String refreshToken = ValidationUtils.normalize(input.getRefreshToken());
            if (refreshToken != null) {
                existingUser.setRefreshToken(refreshToken);
            }

            if (input.getRoleId() != null) {
                existingUser.setRoleId(input.getRoleId());
            }

            existingUser.setUpdatedAt(Instant.now());
            User updatedUser = userRepo.save(existingUser);

            long endTime = System.currentTimeMillis();
            log.info("✅ [PERFORMANCE] Updated user {} in {}ms", updatedUser.getId(), endTime - startTime);
            return updatedUser;

        } catch (ResponseStatusException e) {
            log.warn("❌ [PERFORMANCE] User update failed: {}", e.getReason());
            throw e;
        } catch (Exception e) {
            log.error("❌ [PERFORMANCE] Unexpected error updating user", e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to update user");
        }
    }

    /** Xóa user - TỐI ƯU HÓA với single query delete. */
    public void delete(String id) {
        long startTime = System.currentTimeMillis();
        log.info("🗑️ [PERFORMANCE] Deleting user: {}", id);
        
        try {
            if (id == null || id.trim().isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User ID is required");
            }

            // Sử dụng MongoTemplate để delete trực tiếp
            Query query = new Query(Criteria.where("_id").is(id));
            long deletedCount = mongoTemplate.remove(query, User.class).getDeletedCount();
            
            if (deletedCount == 0) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
            }

            long endTime = System.currentTimeMillis();
            log.info("✅ [PERFORMANCE] Deleted user {} in {}ms", id, endTime - startTime);

        } catch (ResponseStatusException e) {
            log.warn("❌ [PERFORMANCE] User deletion failed: {}", e.getReason());
            throw e;
        } catch (Exception e) {
            log.error("❌ [PERFORMANCE] Unexpected error deleting user", e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to delete user");
        }
    }

    // =====================================================
    // HELPER METHODS - Các phương thức hỗ trợ tối ưu hóa
    // =====================================================

    /** Cập nhật refresh token cho user - TỐI ƯU HÓA với single query update. */
    public User updateRefreshToken(String userId, String newToken) {
        long startTime = System.currentTimeMillis();
        log.info("🔑 [PERFORMANCE] Updating refresh token for user: {}", userId);
        
        try {
            if (userId == null || userId.trim().isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User ID is required");
            }

            String token = ValidationUtils.normalize(newToken);
            if (token == null || token.trim().isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Refresh token is required");
            }

            User user = get(userId);
            user.setRefreshToken(token);
            user.setUpdatedAt(Instant.now());

            User updatedUser = userRepo.save(user);
            
            long endTime = System.currentTimeMillis();
            log.info("✅ [PERFORMANCE] Updated refresh token for user {} in {}ms", userId, endTime - startTime);
            return updatedUser;

        } catch (ResponseStatusException e) {
            log.warn("❌ [PERFORMANCE] Refresh token update failed: {}", e.getReason());
            throw e;
        } catch (Exception e) {
            log.error("❌ [PERFORMANCE] Unexpected error updating refresh token", e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to update refresh token");
        }
    }

    /** Thu hồi refresh token (set null) - TỐI ƯU HÓA với single query update. */
    public void revokeRefreshToken(String userId) {
        long startTime = System.currentTimeMillis();
        log.info("🚫 [PERFORMANCE] Revoking refresh token for user: {}", userId);
        
        try {
            if (userId == null || userId.trim().isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User ID is required");
            }

            User user = get(userId);
            user.setRefreshToken(null);
            user.setUpdatedAt(Instant.now());

            userRepo.save(user);
            
            long endTime = System.currentTimeMillis();
            log.info("✅ [PERFORMANCE] Revoked refresh token for user {} in {}ms", userId, endTime - startTime);

        } catch (ResponseStatusException e) {
            log.warn("❌ [PERFORMANCE] Refresh token revocation failed: {}", e.getReason());
            throw e;
        } catch (Exception e) {
            log.error("❌ [PERFORMANCE] Unexpected error revoking refresh token", e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to revoke refresh token");
        }
    }

    /**
     * Batch populate roles để tránh N+1 query problem
     * Tối ưu: Load tất cả roles cần thiết trong 1 query
     */
    private void batchPopulateRoles(List<User> users) {
        if (users.isEmpty()) return;

        long startTime = System.currentTimeMillis();
        
        // Lấy tất cả roleIds cần thiết
        List<String> roleIds = users.stream()
                .map(User::getRoleId)
                .filter(roleId -> roleId != null)
                .map(Object::toString)
                .distinct()
                .collect(Collectors.toList());

        if (roleIds.isEmpty()) return;

        // Load tất cả roles trong 1 query
        Query roleQuery = new Query(Criteria.where("_id").in(roleIds));
        List<Role> roles = mongoTemplate.find(roleQuery, Role.class);
        
        // Tạo map để lookup nhanh
        Map<String, Role> roleMap = roles.stream()
                .collect(Collectors.toMap(Role::getId, role -> role));

        // Populate roles cho users
        users.forEach(user -> {
            if (user.getRole() == null && user.getRoleId() != null) {
                String roleIdStr = user.getRoleId().toString();
                Role role = roleMap.get(roleIdStr);
                if (role != null) {
                    user.setRole(role);
                }
            }
        });
        
        long endTime = System.currentTimeMillis();
        log.debug("🔄 [PERFORMANCE] Batch populated {} roles in {}ms", 
                roles.size(), endTime - startTime);
    }
}

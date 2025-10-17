package com.example.spring_boot.services;

import com.example.spring_boot.domains.Role;
import com.example.spring_boot.domains.User;
import com.example.spring_boot.repository.RoleRepository;
import com.example.spring_boot.repository.UserRepository;
import com.example.spring_boot.utils.HashPassword;
import com.example.spring_boot.utils.ValidationUtils;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.logging.Logger;

/** Service User dùng embed role snapshot */
@Service
public class UserService {
    private final UserRepository userRepo;
    private final RoleRepository roleRepo;
    private final HashPassword hashPassword;
    private static final Logger logger = Logger.getLogger(UserService.class.getName());

    public UserService(UserRepository userRepo, RoleRepository roleRepo, HashPassword hashPassword) {
        this.userRepo = userRepo;
        this.roleRepo = roleRepo;
        this.hashPassword = hashPassword;
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

            logger.info("User created successfully: " + savedUser.getId());
            return savedUser;

        } catch (ResponseStatusException e) {
            logger.warning("User creation failed: " + e.getReason());
            throw e;
        } catch (Exception e) {
            logger.severe("Unexpected error creating user: " + e.getMessage());
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to create user");
        }
    }

    public List<User> list(String name) {
        try {
            String keyword = ValidationUtils.normalize(name);
            List<User> users = keyword == null ? userRepo.findAll() : userRepo.findByNameContainingIgnoreCase(keyword);

            // Fallback populate role for all users
            for (User user : users) {
                if (user.getRole() == null && user.getRoleId() != null) {
                    roleRepo.findById(user.getRoleId().toHexString()).ifPresent(user::setRole);
                }
            }

            logger.info("Retrieved " + users.size() + " users");
            return users;

        } catch (Exception e) {
            logger.severe("Error retrieving users: " + e.getMessage());
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to retrieve users");
        }
    }

    public User get(String id) {
        try {
            if (id == null || id.trim().isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User ID is required");
            }

            User user = userRepo.findById(id)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

            // Fallback populate role if @DocumentReference doesn't work
            if (user.getRole() == null && user.getRoleId() != null) {
                roleRepo.findById(user.getRoleId().toHexString()).ifPresent(user::setRole);
            }

            logger.info("Retrieved user: " + user.getId());
            return user;

        } catch (ResponseStatusException e) {
            logger.warning("User retrieval failed: " + e.getReason());
            throw e;
        } catch (Exception e) {
            logger.severe("Unexpected error retrieving user: " + e.getMessage());
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to retrieve user");
        }
    }

    public User update(String id, User input) {
        try {
            if (input == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User data is required");
            }

            User existingUser = get(id);

            String name = ValidationUtils.normalize(input.getName());
            if (name != null && !name.trim().isEmpty()) {
                existingUser.setName(name);
            }

            String email = ValidationUtils.normalize(input.getEmail());
            if (email != null && !email.equalsIgnoreCase(existingUser.getEmail())) {
                if (userRepo.existsByEmail(email)) {
                    throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already exists");
                }
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

            logger.info("User updated successfully: " + updatedUser.getId());
            return updatedUser;

        } catch (ResponseStatusException e) {
            logger.warning("User update failed: " + e.getReason());
            throw e;
        } catch (Exception e) {
            logger.severe("Unexpected error updating user: " + e.getMessage());
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to update user");
        }
    }

    public void delete(String id) {
        try {
            if (id == null || id.trim().isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User ID is required");
            }

            if (!userRepo.existsById(id)) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
            }

            userRepo.deleteById(id);
            logger.info("User deleted successfully: " + id);

        } catch (ResponseStatusException e) {
            logger.warning("User deletion failed: " + e.getReason());
            throw e;
        } catch (Exception e) {
            logger.severe("Unexpected error deleting user: " + e.getMessage());
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to delete user");
        }
    }

    // no-op helpers; lưu roleId trực tiếp
    /** Cập nhật refresh token cho user */
    public User updateRefreshToken(String userId, String newToken) {
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
            logger.info("Refresh token updated for user: " + userId);
            return updatedUser;

        } catch (ResponseStatusException e) {
            logger.warning("Refresh token update failed: " + e.getReason());
            throw e;
        } catch (Exception e) {
            logger.severe("Unexpected error updating refresh token: " + e.getMessage());
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to update refresh token");
        }
    }

    /** Thu hồi refresh token (set null) */
    public void revokeRefreshToken(String userId) {
        try {
            if (userId == null || userId.trim().isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User ID is required");
            }

            User user = get(userId);
            user.setRefreshToken(null);
            user.setUpdatedAt(Instant.now());

            userRepo.save(user);
            logger.info("Refresh token revoked for user: " + userId);

        } catch (ResponseStatusException e) {
            logger.warning("Refresh token revocation failed: " + e.getReason());
            throw e;
        } catch (Exception e) {
            logger.severe("Unexpected error revoking refresh token: " + e.getMessage());
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to revoke refresh token");
        }
    }
}

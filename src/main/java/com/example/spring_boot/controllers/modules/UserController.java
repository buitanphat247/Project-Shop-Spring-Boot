package com.example.spring_boot.controllers.modules;

import com.example.spring_boot.domains.User;
import com.example.spring_boot.dto.ApiResponse;
import com.example.spring_boot.dto.PageResponse;
import com.example.spring_boot.services.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/** Module API cho User (embed role) */
@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService service;

    public UserController(UserService service) {
        this.service = service;
    }

    /**
     * Tạo user (embed role)
     * Test API:
     * - POST /api/users
     * - Body:
     * {"name":"A","email":"a@ex.com","password":"123","role":{"id":"ROLE_ID"}}
     */
    @PostMapping
    public ResponseEntity<ApiResponse<User>> create(@RequestBody User input) {
        var user = service.create(input);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(user, "User created successfully"));
    }

    /** Danh sách user; GET /api/users?name=... */
    @GetMapping
    public ApiResponse<PageResponse<User>> list(@RequestParam(value = "name", required = false) String name,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "1000") int size) {
        var items = service.list(name);
        return ApiResponse.success(new PageResponse<>(items, items.size(), page, size), "Users retrieved successfully");
    }

    /** GET /api/users/{id} */
    @GetMapping("/{id}")
    public ApiResponse<User> get(@PathVariable String id) {
        return ApiResponse.success(service.get(id), "User retrieved successfully");
    }

    /** PUT /api/users/{id} */
    @PutMapping("/{id}")
    public ApiResponse<User> update(@PathVariable String id, @RequestBody User input) {
        return ApiResponse.success(service.update(id, input), "User updated successfully");
    }

    /** DELETE /api/users/{id} */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable String id) {
        service.delete(id);
        return ResponseEntity.ok(ApiResponse.success(null, "User deleted successfully"));
    }
}

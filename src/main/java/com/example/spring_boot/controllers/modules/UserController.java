package com.example.spring_boot.controllers.modules;

import com.example.spring_boot.domains.User;
import com.example.spring_boot.dto.ApiResponse;
import com.example.spring_boot.dto.PageResponse;
import com.example.spring_boot.services.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/** Module API cho User (embed role) */
@RestController
@RequestMapping("/api/users")
@Tag(name = "Users", description = "APIs quản lý người dùng (trả về ApiResponse/PageResponse)")
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
    @Operation(summary = "Tạo user")
    public ResponseEntity<ApiResponse<User>> create(@RequestBody User input) {
        var user = service.create(input);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(user, "User created successfully"));
    }

    /** Danh sách user với phân trang; GET /api/users?name=...&page=0&size=10 */
    @GetMapping
    @Operation(summary = "Danh sách user với phân trang (PageResponse)")
    public ApiResponse<PageResponse<User>> list(@RequestParam(value = "name", required = false) String name,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size) {
        var pageResponse = service.listWithPagination(name, page, size);
        return ApiResponse.success(pageResponse, "Users retrieved successfully");
    }

    /** GET /api/users/{id} */
    @GetMapping("/{id}")
    @Operation(summary = "Chi tiết user")
    public ApiResponse<User> get(@PathVariable String id) {
        return ApiResponse.success(service.get(id), "User retrieved successfully");
    }

    /** PUT /api/users/{id} */
    @PutMapping("/{id}")
    @Operation(summary = "Cập nhật user")
    public ApiResponse<User> update(@PathVariable String id, @RequestBody User input) {
        return ApiResponse.success(service.update(id, input), "User updated successfully");
    }

    /** DELETE /api/users/{id} */
    @DeleteMapping("/{id}")
    @Operation(summary = "Xóa user (soft/hard tùy service)")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable String id) {
        service.delete(id);
        return ResponseEntity.ok(ApiResponse.success(null, "User deleted successfully"));
    }
}

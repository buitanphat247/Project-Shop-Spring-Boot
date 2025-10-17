package com.example.spring_boot.controllers.modules;

import com.example.spring_boot.domains.Role;
import com.example.spring_boot.dto.ApiResponse;
import com.example.spring_boot.dto.PageResponse;
import com.example.spring_boot.services.RoleService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/** Module API cho Role (embed-friendly, dùng trong User) */
@RestController
@RequestMapping("/api/roles")
@Tag(name = "Roles", description = "Quản lý quyền (Role) cho người dùng")
public class RoleController {
    private final RoleService service;

    public RoleController(RoleService service) {
        this.service = service;
    }

    /**
     * Tạo role mới
     * Test API:
     * - POST /api/roles
     * - Body: {"name":"ADMIN","description":"Quyền quản trị"}
     */
    @PostMapping
    @Operation(summary = "Tạo role mới")
    public ResponseEntity<ApiResponse<Role>> create(@RequestBody Role input) {
        var role = service.create(input);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(role, "Role created successfully"));
    }

    /** Danh sách role; GET /api/roles?q=... */
    @GetMapping
    @Operation(summary = "Danh sách roles")
    public ApiResponse<PageResponse<Role>> list(@RequestParam(value = "q", required = false) String q,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "1000") int size) {
        var items = service.list(q);
        return ApiResponse.success(new PageResponse<>(items, items.size(), page, size), "Roles retrieved successfully");
    }

    /** GET /api/roles/{id} */
    @GetMapping("/{id}")
    @Operation(summary = "Chi tiết role")
    public ApiResponse<Role> get(@PathVariable String id) {
        return ApiResponse.success(service.get(id), "Role retrieved successfully");
    }

    /**
     * Cập nhật role
     * Test API:
     * - PUT /api/roles/{id}
     * - Body (optional): {"name":"MANAGER","description":"Quản lý"}
     */
    @PutMapping("/{id}")
    @Operation(summary = "Cập nhật role")
    public ApiResponse<Role> update(@PathVariable String id, @RequestBody Role input) {
        return ApiResponse.success(service.update(id, input), "Role updated successfully");
    }

    /** DELETE /api/roles/{id} */
    @DeleteMapping("/{id}")
    @Operation(summary = "Xóa role")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable String id) {
        service.delete(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Role deleted successfully"));
    }
}

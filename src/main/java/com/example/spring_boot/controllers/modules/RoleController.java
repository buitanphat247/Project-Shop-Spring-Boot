package com.example.spring_boot.controllers.modules;

import com.example.spring_boot.domains.Role;
import com.example.spring_boot.dto.ApiResponse;
import com.example.spring_boot.dto.PageResponse;
import com.example.spring_boot.services.RoleService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/** Module API cho Role (embed-friendly, dùng trong User) */
@RestController
@RequestMapping("/api/roles")
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
    public ResponseEntity<ApiResponse<Role>> create(@RequestBody Role input) {
        var role = service.create(input);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(role, "Role created successfully"));
    }

    /** Danh sách role; GET /api/roles?q=... */
    @GetMapping
    public ApiResponse<PageResponse<Role>> list(@RequestParam(value = "q", required = false) String q,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "1000") int size) {
        var items = service.list(q);
        return ApiResponse.success(new PageResponse<>(items, items.size(), page, size), "Roles retrieved successfully");
    }

    /** GET /api/roles/{id} */
    @GetMapping("/{id}")
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
    public ApiResponse<Role> update(@PathVariable String id, @RequestBody Role input) {
        return ApiResponse.success(service.update(id, input), "Role updated successfully");
    }

    /** DELETE /api/roles/{id} */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable String id) {
        service.delete(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Role deleted successfully"));
    }
}

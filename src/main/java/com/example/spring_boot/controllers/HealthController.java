package com.example.spring_boot.controllers;

import com.example.spring_boot.configs.CheckDb;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.actuate.health.Health;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Controller để kiểm tra health của database
 */
@Controller
@RequestMapping("/")
@Tag(name = "Health Controller", description = "API để kiểm tra trạng thái database và ứng dụng")
public class HealthController {

    @Autowired
    private CheckDb checkDb;

    /**
     * Trang kiểm tra database health
     * GET /health-db
     */
    @GetMapping("/health-db")
    @Operation(summary = "Kiểm tra trạng thái database", 
               description = "Hiển thị trang web để kiểm tra kết nối MongoDB")
    public String healthDb(Model model) {
        // Gọi CheckDb để kiểm tra kết nối
        Health health = checkDb.health();
        
        // Chuyển dữ liệu từ CheckDb sang template
        model.addAttribute("status", health.getStatus().getCode());
        model.addAttribute("details", health.getDetails());
        model.addAttribute("timestamp", System.currentTimeMillis());
        model.addAttribute("isUp", health.getStatus().getCode().equals("UP"));
        
        return "clients/health-db";
    }
}

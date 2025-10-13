package com.example.spring_boot.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Controller chính để xử lý các request
 */
@Controller
@RequestMapping("/")
@Tag(name = "Home Controller", description = "API để xử lý các trang chính của ứng dụng")
public class HomeController {
    
    /**
     * Trang chủ
     */
    @GetMapping
    @Operation(summary = "Trang chủ", description = "Hiển thị trang chủ của ứng dụng")
    public String home(Model model) {
        model.addAttribute("title", "Trang chủ");
        model.addAttribute("message", "Chào mừng đến với Spring Boot Shop!");
        return "index";
    }
    
    /**
     * Trang giới thiệu
     */
    @GetMapping("/about")
    @Operation(summary = "Trang giới thiệu", description = "Hiển thị thông tin về ứng dụng")
    public String about(Model model) {
        model.addAttribute("title", "Giới thiệu");
        model.addAttribute("message", "Đây là trang giới thiệu về ứng dụng shop.");
        return "about";
    }
    
    
}

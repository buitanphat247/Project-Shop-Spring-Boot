package com.example.spring_boot.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/auth")
public class AuthController {
    @GetMapping("/signin")
    public String getLogin() {
        return "auths/signin";
    }
    @GetMapping("/signup")
    public String getSignup() {
        return "auths/signup";
    }
}

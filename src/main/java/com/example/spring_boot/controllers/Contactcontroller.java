package com.example.spring_boot.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/contact")
public class Contactcontroller {
    @GetMapping
    public String getContact() {
        return "clients/contact";
    }
}

package com.example.spring_boot.controllers.pages;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class CartDemoController {

    @GetMapping("/cart-demo")
    public String cartDemo() {
        return "cart-demo";
    }
}

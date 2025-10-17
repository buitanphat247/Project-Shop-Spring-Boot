package com.example.spring_boot.controllers.pages;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller("productPagesController")
@RequestMapping("/products")
public class ProductController {

    @GetMapping
    public String getProducts() {
        return "clients/products"; // resolves to src/main/resources/views/clients/products.html
    }

    @GetMapping("detail/{id}")
    public String getMethodName(@PathVariable String id) {
        System.out.println("id: " + id);
        return "clients/product-detail";
    }

    @GetMapping("wishlist")
    public String getWishlist() {
        return "clients/wishlist";
    }
}

package com.example.spring_boot.controllers.pages;


import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;


@Controller("productPagesController")
@RequestMapping("/products")
@RequiredArgsConstructor
public class ProductController {



    @GetMapping
    public String getProducts() {
        return "clients/products"; // resolves to src/main/resources/views/clients/products.html
    }

    @GetMapping("detail/{id}")
    public String getProductDetail(@PathVariable String id, Model model) {

        return "clients/product-detail";

    }

    @GetMapping("wishlist")
    public String getWishlist() {
        return "clients/wishlist";
    }
}

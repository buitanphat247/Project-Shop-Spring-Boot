package com.example.spring_boot.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/admin")
public class AdminController {

    @GetMapping("/products")
    public String products() { return "admin/products"; }

    @GetMapping("/products/create")
    public String productsCreate() { return "admin/products-create"; }

    @GetMapping("/products/deleted")
    public String productsDeleted() { return "admin/products-deleted"; }

    @GetMapping("/news")
    public String news() { return "admin/news"; }

    @GetMapping("/news/create")
    public String newsCreate() { return "admin/news-create"; }

    @GetMapping("/news/deleted")
    public String newsDeleted() { return "admin/news-deleted"; }

    @GetMapping("/orders")
    public String orders() { return "admin/orders"; }

    @GetMapping("/orders/pending")
    public String ordersPending() { return "admin/orders-pending"; }

    @GetMapping("/customers")
    public String customers() { return "admin/customers"; }

    @GetMapping("/customers/blocked-history")
    public String customersBlockedHistory() { return "admin/customers-blocked-history"; }

    @GetMapping("/analytics")
    public String analytics() { return "admin/analytics"; }
}



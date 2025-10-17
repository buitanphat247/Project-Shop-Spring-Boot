package com.example.spring_boot.controllers.pages;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/news")
public class NewsController {
    @GetMapping
    public String getNews() {
        return "clients/news";
    }

    @GetMapping("/detail/{id}")
    public String getNewsDetail(@PathVariable String id) {
        System.out.println("id: " + id);
        return "clients/news-detail";
    }
}

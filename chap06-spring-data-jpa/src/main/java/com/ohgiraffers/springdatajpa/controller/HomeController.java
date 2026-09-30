package com.ohgiraffers.springdatajpa.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
public class HomeController {

    @GetMapping("/")
    public Map<String, Object> home() {
        return Map.of(
                "message", "Menu API server is running.",
                "endpoints", List.of(
                        "/api/menus",
                        "/api/categories",
                        "/swagger-ui/index.html"
                )
        );
    }
}

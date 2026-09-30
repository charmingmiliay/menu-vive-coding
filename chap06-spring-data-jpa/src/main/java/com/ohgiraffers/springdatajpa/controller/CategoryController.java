package com.ohgiraffers.springdatajpa.controller;

import com.ohgiraffers.springdatajpa.common.ResponseMessage;
import com.ohgiraffers.springdatajpa.dto.CategoryDTO;
import com.ohgiraffers.springdatajpa.service.CategoryService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryService categoryService;

    // @Autowired를 작성하지 않아도 자동 적용됨을 잊지 말자.
    // @Autowired는 Spring에서 필요한 객체를 자동으로 주입해주는 어노테이션
    // 컨트롤러는 서비스를 사용해야 하고, 서비스는 리포지토리를 사용해야 한다. 그때 autowired가 필요한 객체를 연결해준다.
    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping
    public ResponseEntity<ResponseMessage> findAllCategories() {
        List<CategoryDTO> categories = categoryService.findAllCategories();
        
        Map<String, Object> resultMap = new HashMap<>();
        resultMap.put("categories", categories);
        
        ResponseMessage responseMessage = new ResponseMessage(
                HttpStatus.OK.value(),
                "카테고리 목록 조회 성공",
                resultMap
        );
        
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(responseMessage);
    }

    @GetMapping("/{categoryCode}")
    public ResponseEntity<ResponseMessage> findCategoryByCode(@PathVariable int categoryCode) {
        CategoryDTO category = categoryService.findCategoryByCode(categoryCode);
        
        Map<String, Object> resultMap = new HashMap<>();
        resultMap.put("category", category);
        
        ResponseMessage responseMessage = new ResponseMessage(
                HttpStatus.OK.value(),
                "카테고리 상세 조회 성공",
                resultMap
        );
        
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(responseMessage);
    }
} 
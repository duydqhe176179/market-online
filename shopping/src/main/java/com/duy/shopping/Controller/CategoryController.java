package com.duy.shopping.Controller;

import com.duy.shopping.Repository.CategoryRepo;
import com.duy.shopping.dto.CategoryDto;
import com.duy.shopping.model.Category;
import com.duy.shopping.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("http://localhost:3000")
public class CategoryController {
    @Autowired
    private CategoryRepo repo;

    @Autowired
    private CategoryService categoryService;

    @GetMapping("/category")
    List<Category> getAllCates() {return repo.findAll();}

    @PostMapping("/category/add")
    ResponseEntity<?> addCategory(@RequestBody CategoryDto categoryDto) {
        return categoryService.addCategory(categoryDto);
    }
}

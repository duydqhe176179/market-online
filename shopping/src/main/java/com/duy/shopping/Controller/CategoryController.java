package com.duy.shopping.Controller;

import com.duy.shopping.Repository.CategoryRepo;
import com.duy.shopping.model.Category;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@CrossOrigin("http://localhost:3000")
public class CategoryController {
    @Autowired
    private CategoryRepo repo;

    @GetMapping("/category")
    List<Category> getAllCates() {return repo.findAll();}
}

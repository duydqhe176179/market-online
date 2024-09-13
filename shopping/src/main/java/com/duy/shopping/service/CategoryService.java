package com.duy.shopping.service;

import com.duy.shopping.dto.CategoryDto;
import com.duy.shopping.model.Category;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface CategoryService {
    ResponseEntity<?> addCategory(CategoryDto categoryDto);
    List<Category> getAllCategories();
}

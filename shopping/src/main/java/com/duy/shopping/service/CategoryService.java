package com.duy.shopping.service;

import com.duy.shopping.dto.CategoryDto;
import org.springframework.http.ResponseEntity;

public interface CategoryService {
    ResponseEntity<?> addCategory(CategoryDto categoryDto);
}

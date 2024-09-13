package com.duy.shopping.repository;

import com.duy.shopping.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepo extends JpaRepository<Category, Integer> {
    Category findById(int id);
}

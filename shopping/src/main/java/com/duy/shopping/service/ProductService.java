package com.duy.shopping.service;

import com.duy.shopping.dto.ProductDto;
import com.duy.shopping.model.Product;
import org.springframework.http.ResponseEntity;

import java.util.List;


public interface ProductService {
    ResponseEntity<?> addProduct(ProductDto productDto);
    List<Product> getAllProduct();
}

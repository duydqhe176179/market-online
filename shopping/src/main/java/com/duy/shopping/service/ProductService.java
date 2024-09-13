package com.duy.shopping.service;

import com.duy.shopping.dto.ProductDto;
import com.duy.shopping.model.Product;
import org.springframework.http.ResponseEntity;

import java.util.List;


public interface ProductService {
    List<Product> getBestSeller();
    Product getProduct(long id);
    ResponseEntity<?> addProduct(ProductDto productDto);
    ResponseEntity<?> updateProduct(ProductDto productDto);
    List<Product> getAllProductOfShop(long id);
    List<Product> getAllProduct();
}

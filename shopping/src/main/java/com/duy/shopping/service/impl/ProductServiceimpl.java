package com.duy.shopping.service.impl;

import com.duy.shopping.Repository.CategoryRepo;
import com.duy.shopping.Repository.ProductRepository;
import com.duy.shopping.Repository.UserRepository;
import com.duy.shopping.dto.ProductDto;
import com.duy.shopping.model.Product;
import com.duy.shopping.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductServiceimpl implements ProductService {
    @Autowired
    private CategoryRepo categoryRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Override
    public ResponseEntity<?> addProduct(ProductDto productDto) {
        Product product = new Product();
        product.setShop(userRepository.findById(productDto.getIdShop()).get());
        product.setName(productDto.getName());
        product.setImage(productDto.getImage());
        product.setPrice(productDto.getPrice());
        product.setDescription(productDto.getDescription());
        product.setMaterial(productDto.getMaterial());
        product.setRemain(productDto.getRemain());
        product.setSale(productDto.getSale());
        product.setCategory(categoryRepository.findById(productDto.getCategoryId()));
        product.setNumberOfSale(0);
        product.setStatus("Đang chờ duyệt");

        productRepository.save(product);
        return ResponseEntity.ok(product);
    }

    @Override
    public List<Product> getAllProduct() {
        return productRepository.findAll();
    }
}

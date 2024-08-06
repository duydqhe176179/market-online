package com.duy.shopping.Controller;

import com.duy.shopping.Repository.ProductRepository;
import com.duy.shopping.Repository.RateRepository;
import com.duy.shopping.model.Product;
import com.duy.shopping.model.RateProduct;
import com.duy.shopping.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("http://localhost:3000/")
public class ProductController {
    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private RateRepository rateRepo;

    @Autowired
    private ProductService productService;

    @GetMapping("/bestseller")
    public List<Product> getBestSeller() {
        List<Product> allProduct = productRepository.findAll();
        allProduct.sort((o1, o2) -> Integer.compare(o2.getNumberOfSale(), o1.getNumberOfSale()));
        return allProduct.subList(0, 6);
    }

    @GetMapping("/product/{id}")
    public Product getProduct(@PathVariable long id) {
        System.out.println(productRepository.findByIdProduct(id));
        return productRepository.findByIdProduct(id).orElseThrow(() -> new RuntimeException("Product not found"));
    }

    @GetMapping("/product/rate/{id}")
    public List<RateProduct> getRateProduct(@PathVariable long id) {
        return rateRepo.findRateProductByIdProduct(id);
    }

    @GetMapping("/product/shop/{id}")
    public List<Product> getAllProduct(@PathVariable long id) {
        return productRepository.findByIdShop(id);
    }

    @GetMapping("/products")
    public List<Product> getAllProduct() {
        return productService.getAllProduct();
    }
}

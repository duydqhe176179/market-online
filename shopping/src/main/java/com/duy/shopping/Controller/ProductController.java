package com.duy.shopping.controller;

import com.duy.shopping.repository.ProductRepository;
import com.duy.shopping.repository.RateRepository;
import com.duy.shopping.model.Product;
import com.duy.shopping.model.RateProduct;
import com.duy.shopping.service.ProductService;
import com.duy.shopping.service.RateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

import static com.duy.shopping.constant.Constant.URL_ORIGIN;

@RestController
@CrossOrigin(URL_ORIGIN)
public class ProductController {

    @Autowired
    private RateService rateService;

    @Autowired
    private ProductService productService;

    @GetMapping("/bestseller")
    public List<Product> getBestSeller() {
        return productService.getBestSeller();
    }

    @GetMapping("/product/{id}")
    public Product getProduct(@PathVariable long id) {
        return productService.getProduct(id);
    }

    @GetMapping("/product/rate/{id}")
    public List<RateProduct> getRateProduct(@PathVariable long id) {
        return rateService.getRateProduct(id);
    }

    @GetMapping("/product/shop/{id}")
    public List<Product> getAllProduct(@PathVariable long id) {
        return productService.getAllProductOfShop(id);
    }

    @GetMapping("/products")
    public List<Product> getAllProduct() {
        return productService.getAllProduct();
    }
}

package com.duy.shopping.Controller;

import com.duy.shopping.Repository.ProductRepository;
import com.duy.shopping.model.Product;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@CrossOrigin("http://localhost:3000/")
public class ProductController {
    @Autowired
    private ProductRepository repo;

    @GetMapping("/bestseller")
    public List<Product> getBestSeller() {
        List<Product>  allProduct=repo.findAll();
        allProduct.sort((o1, o2) -> Integer.compare(o2.getNumberOfSale(), o1.getNumberOfSale()));
        return allProduct.subList(0,6);
    }


}

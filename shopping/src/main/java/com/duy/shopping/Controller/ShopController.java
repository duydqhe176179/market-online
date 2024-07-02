package com.duy.shopping.Controller;

import com.duy.shopping.Repository.ProductRepository;
import com.duy.shopping.Repository.UserRepository;
import com.duy.shopping.dto.ShopInfoDto;
import com.duy.shopping.model.Product;
import com.duy.shopping.model.RateProduct;
import com.duy.shopping.model.User;
import com.duy.shopping.service.RateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@CrossOrigin("http://localhost:3000/")
public class ShopController {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private RateService rateService;

    @GetMapping("/shop/{id}")
    public Object getInfoShop(@PathVariable long id) {
        User shop = userRepository.findById(id);
        List<Product> products = productRepository.findByIdShop(id);
        List<RateProduct> allRate=rateService.getAllRates(id);
        return new ShopInfoDto(shop,products,allRate);
    }
}

package com.duy.shopping.service.impl;

import com.duy.shopping.dto.ShopInfoDto;
import com.duy.shopping.model.Product;
import com.duy.shopping.model.RateProduct;
import com.duy.shopping.model.User;
import com.duy.shopping.repository.ProductRepository;
import com.duy.shopping.repository.UserRepository;
import com.duy.shopping.service.RateService;
import com.duy.shopping.service.ShopService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class ShopServiceImpl implements ShopService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private RateService rateService;

    @Override
    public Object getInfoShop(long id) {
        User shop = userRepository.findById(id);
        List<Product> products = productRepository.findByIdShop(id);
        List<RateProduct> allRate = rateService.getAllRates(id);
        return new ShopInfoDto(shop, products, allRate);
    }
}

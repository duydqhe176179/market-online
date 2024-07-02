package com.duy.shopping.service.impl;

import com.duy.shopping.Repository.ProductRepository;
import com.duy.shopping.Repository.RateRepository;
import com.duy.shopping.model.Product;
import com.duy.shopping.model.RateProduct;
import com.duy.shopping.service.RateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class RateServiceImpl implements RateService {
    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private RateRepository rateRepository;

    @Override
    public List<RateProduct> getAllRates(long idShop) {
        List<Product> allProduct = productRepository.findByIdShop(idShop);
        if (allProduct.isEmpty()) {
            return null;
        } else {
            List<RateProduct> listRateProduct = new ArrayList<>();
            for (Product product : allProduct) {
                List<RateProduct> rateEveryProduct=rateRepository.findRateProductByIdProduct((product.getIdProduct()));
                listRateProduct.addAll(rateEveryProduct);
            }
            return listRateProduct;
        }
    }
}

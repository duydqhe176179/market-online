package com.duy.shopping.service.impl;

import com.duy.shopping.Repository.OrderItemRepo;
import com.duy.shopping.Repository.ProductRepository;
import com.duy.shopping.Repository.RateRepository;
import com.duy.shopping.Repository.UserRepository;
import com.duy.shopping.dto.RateDto;
import com.duy.shopping.model.Product;
import com.duy.shopping.model.RateProduct;
import com.duy.shopping.service.RateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
public class RateServiceImpl implements RateService {
    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private RateRepository rateRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OrderItemRepo orderItemRepo;

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

    @Override
    public ResponseEntity<?> addRateProduct(RateDto rateDto) {
        RateProduct rateProduct = new RateProduct();
        rateProduct.setProduct(productRepository.findByIdProduct(rateDto.getIdProduct()).get());
        rateProduct.setUserRate(userRepository.findById(rateDto.getIdUser()).get());
        rateProduct.setOrderItem(orderItemRepo.findById(rateDto.getIdOrderItem()).get());
        rateProduct.setStar(rateDto.getStar());
        rateProduct.setReview(rateDto.getReview());
        LocalDate date = LocalDate.now();
        Date currentDate = Date.from(date.atStartOfDay(ZoneId.systemDefault()).toInstant());
        rateProduct.setDateReview(currentDate);
        rateRepository.save(rateProduct);
        return ResponseEntity.ok(rateProduct);
    }
}

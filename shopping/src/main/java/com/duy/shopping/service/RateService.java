package com.duy.shopping.service;

import com.duy.shopping.dto.RateDto;
import com.duy.shopping.model.RateProduct;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface RateService {
    public List<RateProduct> getAllRates(long idShop);
    List<RateProduct> getRateProduct(long id);
    ResponseEntity<?> addRateProduct(RateDto rateDto);
    ResponseEntity<?> getRateOfOrderItem(long idOrderItem);
}

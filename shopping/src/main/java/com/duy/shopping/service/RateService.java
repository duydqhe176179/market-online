package com.duy.shopping.service;

import com.duy.shopping.Repository.ProductRepository;
import com.duy.shopping.dto.RateDto;
import com.duy.shopping.model.RateProduct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface RateService {
    public List<RateProduct> getAllRates(long idShop);
    ResponseEntity<?> addRateProduct(RateDto rateDto);
}

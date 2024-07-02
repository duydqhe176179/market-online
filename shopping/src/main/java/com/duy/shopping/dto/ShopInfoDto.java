package com.duy.shopping.dto;

import com.duy.shopping.model.Product;
import com.duy.shopping.model.RateProduct;
import com.duy.shopping.model.User;
import lombok.Data;

import java.util.List;

@Data
public class ShopInfoDto {
    private User shop;
    private List<Product> products;
    private List<RateProduct> allRate;


    public ShopInfoDto(User shop, List<Product> products, List<RateProduct> allRate) {
        this.shop = shop;
        this.products = products;
        this.allRate = allRate;
    }
}

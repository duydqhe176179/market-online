package com.duy.shopping.dto;

import lombok.Data;

import java.util.List;

@Data
public class ProductDto {
    private Long idShop;
    private List<String> image;
    private String name;
    private int categoryId;
    private String material;
    private String description;
    private double price;
    private int remain;
    private int sale;
}

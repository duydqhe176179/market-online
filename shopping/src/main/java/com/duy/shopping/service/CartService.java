package com.duy.shopping.service;

import com.duy.shopping.dto.CartDto;
import com.duy.shopping.model.Cart;

public interface CartService {
    public Cart addCart(CartDto cartDto);
}

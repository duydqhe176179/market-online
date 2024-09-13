package com.duy.shopping.service;

import com.duy.shopping.dto.CartDto;
import com.duy.shopping.model.Cart;
import org.springframework.http.ResponseEntity;

public interface CartService {
    public Cart addCart(CartDto cartDto);
    ResponseEntity<?> deleteCart(long idCart);
    ResponseEntity<?> deleteAllCart(long idUser);
    ResponseEntity<?> getCartByIdUser(long idUser);
    ResponseEntity<?> handleQuantity(long idCart,int quantity);
}

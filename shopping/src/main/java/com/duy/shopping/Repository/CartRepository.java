package com.duy.shopping.Repository;

import com.duy.shopping.model.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CartRepository extends JpaRepository<Cart, Long> {
    @Query("SELECT c FROM Cart c WHERE c.product.idProduct = :idProduct AND c.user.id=:idUser")
    Cart findCartByIdUserAndIdProduct(long idUser, long idProduct);

    @Query("SELECT c FROM Cart c WHERE c.user.id=:idUser")
    List<Cart> findCartsByIdUser(long idUser);

    Cart findCartById(long id);
    void deleteById(long id);
}

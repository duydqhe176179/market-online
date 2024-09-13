package com.duy.shopping.repository;

import com.duy.shopping.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByUsername(String username);
    User findByEmail(String email);
    User findById(long id);
    @Query("SELECT u FROM User u WHERE u.phone = :phone")
    User findByPhone(String phone);
}

package com.duy.shopping.Controller;

import com.duy.shopping.Repository.UserRepository;
import com.duy.shopping.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("http://localhost:3000")
public class UserController {
    @Autowired
    private UserRepository repo;

    @PostMapping("/signup")
    User newUser(@RequestBody User newUser) {
        return repo.save(newUser);
    }

    @GetMapping("/users")
    List<User> getAllUsers() {
        return repo.findAll();
    }

    @PostMapping("/signin")
    public ResponseEntity<?> signin(@RequestBody User newuser) {
        User user = repo.findByUsernameAndPassword(newuser.getUsername(), newuser.getPassword());
        return new ResponseEntity<>(user, HttpStatus.OK);
    }
}

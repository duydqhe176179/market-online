package com.duy.shopping.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class JWTUtil {
    @Value("dinhquangduy")
    private String secretKey;
    @Value("86400000")
    private String expiration;

    public String getUsernameFromToken(String token) {
        Claims claims = extractAllClaims(token);
        return claims.getSubject();
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser().setSigningKey(secretKey).parseClaimsJws(token).getBody();
    }

    public String generateToken(UserDetails userDetails) {
//        Date currentDate = new Date();
        String token = Jwts.builder().setSubject(userDetails.getUsername())
//                        .setIssuedAt(currentDate)
//                        .setExpiration(new Date(currentDate.getTime() + expiration))
                        .signWith(SignatureAlgorithm.HS256, secretKey).compact();
        System.out.println("token : " + token);
        return token;
    }

    public Boolean validateToken(String token, UserDetails userDetails) {
        final String username = getUsernameFromToken(token);
        return (username.equals(userDetails.getUsername()));
    }
}

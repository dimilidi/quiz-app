package org.lididimi.quize.security.service;

import org.springframework.security.core.userdetails.UserDetails;

import java.util.List;
import java.util.Map;

public interface JwtService {
    String generateToken(String email, String name, List<String> roles);

    String extractUsername(String token);

    Boolean validateToken(String token, UserDetails userDetails);
}

package org.lididimi.quize.security.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import lombok.extern.slf4j.Slf4j;
import org.lididimi.quize.service.TokenBlackListService;
import org.springframework.beans.factory.annotation.Value;

import java.nio.charset.StandardCharsets;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.function.Function;

@Slf4j
@Service
public class JwtServiceImpl implements JwtService {

    private final String jwtSecret;
    private final long expiration;
    private final TokenBlackListService tokenBlackListService;

    public JwtServiceImpl(@Value("${jwt.secret}") String jwtSecret,
                          @Value("${jwt.expiration}") long expiration, TokenBlackListService tokenBlackListService) {
        this.jwtSecret = jwtSecret;
        this.expiration = expiration;
        this.tokenBlackListService = tokenBlackListService;
    }

    @Override
    public String generateToken(String email, String name, List<String> roles) {
        Claims claims = Jwts.claims().setSubject(email);
        claims.put("name", name);
        claims.put("roles", roles);

        return createToken(claims, email);
    }

    @Override
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    @Override
    public Boolean validateToken(String token, UserDetails userDetails) {
        log.info("Validated JWT token: {}", token);
        final String username = extractUsername(token);

        if (tokenBlackListService.isBlacklisted(token)) {
            return false;
        }

        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    private Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser().setSigningKey(getSigningKey()).parseClaimsJws(token).getBody();
    }

    private String createToken(Map<String, Object> claims, String subject) {
        return  Jwts
                .builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(SignatureAlgorithm.HS512, getSigningKey())
                .compact();
    }

    private Key getSigningKey() {
        byte[] keyBytes = jwtSecret.getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}

package org.lididimi.quize.security.filter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.lididimi.quize.security.service.JwtService;
import org.lididimi.quize.security.service.QuizUserDetailsService;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;


@Slf4j
@Component
public class JwtFilter extends OncePerRequestFilter {
    private final JwtService jwtService;
    private final QuizUserDetailsService restaurantUserDetailsService;
    private String username;

    public JwtFilter(JwtService jwtService, JwtService jwtService1, QuizUserDetailsService restaurantUserDetailsService) {
        this.jwtService = jwtService;
        this.restaurantUserDetailsService = restaurantUserDetailsService;
    }


    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        final String authorizationHeader = request.getHeader("Authorization");

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            String jwt = authorizationHeader.substring(7);

            if (jwt.isEmpty()) {
                log.warn("JWT token is empty");
            } else {
                try {
                    username = jwtService.extractUsername(jwt);
                    log.info("JWT token received in request: {}", jwt);

                    if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                        UserDetails userDetails = this.restaurantUserDetailsService.loadUserByUsername(username);

                        if (jwtService.validateToken(jwt, userDetails)) {
                            // Set up Spring Security context.
                            UsernamePasswordAuthenticationToken authenticationToken =
                                    new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                            authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                            SecurityContextHolder.getContext().setAuthentication(authenticationToken);
                        } else {
                            log.warn("Invalid JWT token received: {}", jwt);
                        }
                    }
                } catch (Exception e) {
                    log.error("Error extracting username from JWT: {}", e.getMessage());
                }
            }
        } else {
            log.warn("Authorization header is missing or does not start with Bearer");
        }

        filterChain.doFilter(request, response);
    }


    public boolean isAdmin() {
        return SecurityContextHolder.getContext().getAuthentication().getAuthorities().stream()
                .anyMatch(authority -> authority.getAuthority().equals("ROLE_ADMIN"));
    }

    public boolean isUser() {
        return SecurityContextHolder.getContext().getAuthentication().getAuthorities().stream()
                .anyMatch(authority -> authority.getAuthority().equals("ROLE_USER"));
    }

    public String currentUser() {
        return username;
    }
}

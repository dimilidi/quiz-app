package org.lididimi.quize.security.service;

import lombok.extern.slf4j.Slf4j;
import org.lididimi.quize.model.entity.Role;
import org.lididimi.quize.model.entity.User;
import org.lididimi.quize.model.enums.UserRoleNameEnum;
import org.lididimi.quize.repository.UserRepository;
import org.lididimi.quize.security.user.QuizUserDetails;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;


@Slf4j
@Service
public class QuizUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;
    private QuizUserDetails userEntityDetail;

    public QuizUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        log.info("Fetching user details for email: {}", email);
        userEntityDetail = userRepository
                .findByEmail(email)
                .map(QuizUserDetailsService::mapToQuizUserDetails)
                .orElseThrow(() -> new UsernameNotFoundException("User with email " + email + " not found!"));


        return userRepository
                .findByEmail(email)
                .map(QuizUserDetailsService::mapToUserDetails)
                .orElseThrow(() -> new UsernameNotFoundException("User with email " + email + " not found!"));
    }

    private static UserDetails mapToUserDetails(User userEntity) {

        return new QuizUserDetails(
                userEntity.getEmail(),
                userEntity.getName(),
                userEntity.getPassword(),
                userEntity.getStatus(),
                userEntity.getRoles().stream().map(Role::getName).map(QuizUserDetailsService::mapToGrantedAuth).toList()
        );
    }

    private static QuizUserDetails mapToQuizUserDetails(User userEntity) {

        return new QuizUserDetails(
                userEntity.getEmail(),
                userEntity.getName(),
                userEntity.getPassword(),
                userEntity.getStatus(),
                userEntity.getRoles().stream().map(Role::getName).map(QuizUserDetailsService::mapToGrantedAuth).toList()
        );
    }

    private static GrantedAuthority mapToGrantedAuth(UserRoleNameEnum role) {
        return new SimpleGrantedAuthority("ROLE_" + role.toString());
    }


    public QuizUserDetails getUserDetails() {
        return userEntityDetail;
    }
}
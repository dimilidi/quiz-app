package org.lididimi.quize.service.Impl;

import jakarta.mail.MessagingException;
import org.lididimi.quize.constants.QuizConstants;
import org.lididimi.quize.exception.user.AlreadyExistsException;
import org.lididimi.quize.exception.user.BadCredentialsException;
import org.lididimi.quize.model.dto.email.EmailDTO;
import org.lididimi.quize.model.dto.user.UserDTO;
import org.lididimi.quize.model.dto.user.UserLoginDTO;
import org.lididimi.quize.model.dto.user.UserRegisterByAdminDTO;
import org.lididimi.quize.model.dto.user.UserRegisterDTO;
import org.lididimi.quize.model.entity.Role;
import org.lididimi.quize.model.entity.User;
import org.lididimi.quize.model.enums.StatusNameEnum;
import org.lididimi.quize.model.enums.UserRoleNameEnum;
import org.lididimi.quize.repository.RoleRepository;
import org.lididimi.quize.repository.UserRepository;
import org.lididimi.quize.security.service.JwtService;
import org.lididimi.quize.security.service.QuizUserDetailsService;
import org.lididimi.quize.security.user.QuizUserDetails;
import org.lididimi.quize.service.AuthService;

import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.lididimi.quize.service.PasswordService;
import org.modelmapper.ModelMapper;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;



@Slf4j
@Service
public class AuthServiceImpl implements AuthService {
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;
    private final AuthenticationManager authenticationManager;
    public final QuizUserDetailsService restaurantUserDetailsService;
    private final PasswordEncoder passwordEncoder;
    private final RoleRepository roleRepository;
    private final JwtService jwtService;
    private final PasswordService passwordService;

    public AuthServiceImpl(
            UserRepository userRepository,
            ModelMapper modelMapper,
            AuthenticationManager authenticationManager,
            QuizUserDetailsService restaurantUserDetailsService,
            PasswordEncoder passwordEncoder,
            RoleRepository roleRepository,
            JwtService jwtService, PasswordService passwordService
    ) {
        this.userRepository = userRepository;
        this.modelMapper = modelMapper;
        this.authenticationManager = authenticationManager;
        this.restaurantUserDetailsService = restaurantUserDetailsService;
        this.passwordEncoder = passwordEncoder;
        this.roleRepository = roleRepository;
        this.jwtService = jwtService;
        this.passwordService = passwordService;
    }

 /*   @Transactional
    @Override
    public UserDTO register(UserRegisterDTO userRegisterDTO, UserRoleNameEnum roleName) {
        Optional<User> userOptional = userRepository.findByEmail(userRegisterDTO.getEmail());

        if (userOptional.isPresent()) {
            throw new AlreadyExistsException(QuizConstants.EMAIL_EXISTS);
        }

        Optional<Role> optionalRole = roleRepository.findByName(roleName);

        if (optionalRole.isEmpty()) {
            throw new IllegalArgumentException("Invalid role name provided");
        }

        User userEntity = modelMapper.map(userRegisterDTO, User.class);
        userEntity.setPassword(passwordEncoder.encode(userRegisterDTO.getPassword()));


        if (roleName == UserRoleNameEnum.STUDENT) {
            userEntity.setStatus(StatusNameEnum.INACTIVE);
        } else {
            userEntity.setStatus(StatusNameEnum.ACTIVE);
        }

        userEntity.setRoles(List.of(optionalRole.get()));

        userRepository.save(userEntity);
        return modelMapper.map(userEntity, UserDTO.class);
    }*/



    @Transactional
    @Override
    public UserDTO registerByAdmin(UserRegisterByAdminDTO userRegisterDTO, UserRoleNameEnum roleName) throws MessagingException, MessagingException {
        Optional<User> userOptional = userRepository.findByEmail(userRegisterDTO.getEmail());

        if (userOptional.isPresent()) {
            throw new AlreadyExistsException(QuizConstants.EMAIL_EXISTS);
        }

        Optional<Role> optionalRole = roleRepository.findByName(roleName);

        if (optionalRole.isEmpty()) {
            throw new IllegalArgumentException("Invalid role name provided");
        }

        User userEntity = modelMapper.map(userRegisterDTO, User.class);
        userEntity.setPassword(passwordEncoder.encode(""));

        if (roleName == UserRoleNameEnum.STUDENT) {
            userEntity.setStatus(StatusNameEnum.INACTIVE);
        } else {
            userEntity.setStatus(StatusNameEnum.ACTIVE);
        }

        userEntity.setRoles(List.of(optionalRole.get()));

        userRepository.save(userEntity);

        // Generate password reset token and send email
        EmailDTO emailDTO = new EmailDTO();
        emailDTO.setEmail(userEntity.getEmail());
        String responseMessage = passwordService.forgotPassword(emailDTO); // Generates token and sends email

        log.info(responseMessage); // Log the message to confirm email sending

        return modelMapper.map(userEntity, UserDTO.class);
    }


    @Transactional
    @Override
    public UserDTO register(UserRegisterDTO userRegisterDTO) throws MessagingException {
        return register(userRegisterDTO);
    }


    @Override
    public String login(UserLoginDTO userLoginDTO) {
        try {
            Authentication authentication = performAuthentication(userLoginDTO);
            if (authentication.isAuthenticated()) {
               QuizUserDetails currentUser = restaurantUserDetailsService.getUserDetails();
                return processAuthenticatedUser(currentUser);
            } else {
                log.error("Authentication Failed");
                throw new BadCredentialsException(QuizConstants.BAD_CREDENTIALS);
            }
        } catch (BadCredentialsException e) {
            log.error("Invalid credentials: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("Unexpected error during authentication: {}", e.getMessage());
            throw new BadCredentialsException(QuizConstants.BAD_CREDENTIALS);
        }
    }

    private Authentication performAuthentication(UserLoginDTO userLoginDTO) {
        return authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(userLoginDTO.getEmail(), userLoginDTO.getPassword())
        );
    }

    private String processAuthenticatedUser(QuizUserDetails currentUser) {
        if (StatusNameEnum.ACTIVE.equals(currentUser.getStatus())) {
            log.info("Active User");
            log.info(currentUser.toString());

            List<String> roles = currentUser.getRoles();
            log.info("Authorities {}", currentUser.getAuthorities().stream().toList());

            return jwtService.generateToken(currentUser.getUsername(), currentUser.getName(), roles);
        } else {
            log.info("Wait for admin approval");
            throw new BadCredentialsException(QuizConstants.UNAPPROVED);
        }
    }

}
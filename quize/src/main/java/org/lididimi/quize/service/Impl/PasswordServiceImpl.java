package org.lididimi.quize.service.Impl;

import jakarta.mail.MessagingException;
import lombok.extern.slf4j.Slf4j;
import org.lididimi.quize.constants.QuizConstants;
import org.lididimi.quize.exception.common.ObjectNotFoundException;
import org.lididimi.quize.exception.user.BadCredentialsException;
import org.lididimi.quize.model.dto.email.EmailDTO;
import org.lididimi.quize.model.entity.PasswordResetToken;
import org.lididimi.quize.model.entity.User;
import org.lididimi.quize.repository.PasswordResetTokenRepository;
import org.lididimi.quize.repository.UserRepository;
import org.lididimi.quize.security.service.QuizUserDetailsService;
import org.lididimi.quize.service.PasswordService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.Optional;
import java.util.UUID;


@Slf4j
@Service
public class PasswordServiceImpl implements PasswordService {
    private final UserRepository userRepository;

    public final QuizUserDetailsService restaurantUserDetailsService;
    private final PasswordEncoder passwordEncoder;
    private final EmailServiceImpl emailService;
    private final PasswordResetTokenRepository tokenRepository;


    public PasswordServiceImpl(
            UserRepository userRepository,
            QuizUserDetailsService restaurantUserDetailsService,
            PasswordEncoder passwordEncoder,
            EmailServiceImpl emailService,
            PasswordResetTokenRepository tokenRepository
    ) {
        this.userRepository = userRepository;
        this.restaurantUserDetailsService = restaurantUserDetailsService;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
        this.tokenRepository = tokenRepository;
    }


    @Override
    public String forgotPassword(EmailDTO emailDTO) throws MessagingException {
        Optional<User> optionalUser = userRepository.findByEmail(emailDTO.getEmail());
        if (optionalUser.isPresent() && !optionalUser.get().getEmail().isEmpty()) {
            User user = optionalUser.get();
            emailService.forgotMail(user.getEmail(), "Link to reset password", passwordResetToken(user.getEmail()));
            return QuizConstants.CHECK_EMAIL;
        } else {
            throw new ObjectNotFoundException(QuizConstants.EMAIL_NOT_FOUND);
        }
    }

    @Override
    public boolean validatePasswordResetToken(String token) {
        Optional<PasswordResetToken> tokenOpt = tokenRepository.findByToken(token);
        if (tokenOpt.isPresent()) {
            PasswordResetToken resetToken = tokenOpt.get();
            return !resetToken.isExpired();
        }
        return false;
    }

    @Override
    public String updatePassword(String token, String newPassword) {
        Optional<PasswordResetToken> optionalToken = tokenRepository.findByToken(token);
        if (optionalToken.isPresent()) {
            PasswordResetToken resetToken = optionalToken.get();
            User user = resetToken.getUser();
            if (resetToken.isExpired()) {
                throw new BadCredentialsException(QuizConstants.TOKEN_EXPIRED);
            }
            user.setPassword(passwordEncoder.encode(newPassword));
            userRepository.save(user);
            return QuizConstants.PASSWORD_UPDATE_SUCCESS;
        } else {
            throw new BadCredentialsException(QuizConstants.TOKEN_EXPIRED);
        }
    }

    private String passwordResetToken(String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        String resetUrl = "";
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            String token = UUID.randomUUID().toString();
            PasswordResetToken resetToken = new PasswordResetToken();
            resetToken.setToken(token);
            resetToken.setUser(user);
            resetToken.setExpiryDate(new Date(System.currentTimeMillis() + 3600000)); // 1 hour expiry
            tokenRepository.save(resetToken);
            resetUrl = QuizConstants.TOKEN_RESET_URL_BASE + token;
        }
        return resetUrl;
    }
}



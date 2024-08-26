package org.lididimi.quize.service;

import jakarta.mail.MessagingException;
import org.lididimi.quize.model.dto.email.EmailDTO;

public interface PasswordService {
    String forgotPassword(EmailDTO emailDTO) throws MessagingException;

    boolean validatePasswordResetToken(String token);

    String updatePassword(String token, String newPassword);
}

package org.lididimi.quize.service;

import jakarta.mail.MessagingException;

import java.util.List;

public interface EmailService {

    void sendSimpleMessage(String to, String subject, String text, List<String> list);

    void forgotMail(String to, String subject, String resetUrl) throws MessagingException;
}

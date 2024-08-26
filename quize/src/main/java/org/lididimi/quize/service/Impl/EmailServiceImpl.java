package org.lididimi.quize.service.Impl;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.Data;
import org.lididimi.quize.service.EmailService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.util.List;

@Data
@Service
public class EmailServiceImpl implements EmailService {
    private final JavaMailSender emailSender;

    @Value("${smtp_username}")
    private String fromAddress;


    @Override
    public void sendSimpleMessage(String to, String subject, String text, List<String> list) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromAddress);
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);
        if (list != null && !list.isEmpty()) {
            message.setCc(getCcArray(list));
        }

        emailSender.send(message);
    }

    @Override
    public void forgotMail(String to, String subject, String resetUrl) throws MessagingException {
        MimeMessage message = emailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);
        helper.setFrom(fromAddress);
        helper.setTo(to);
        helper.setSubject(subject);
        String htmlMsg = "<p><b>To reset your password, click the link below:</b><br>" +
                "<a href=\"" + resetUrl + "\">Reset Password</a></p>";
        message.setContent(htmlMsg, "text/html");
        message.setContent(htmlMsg, "text/html");
        emailSender.send(message);
    }

    private String[] getCcArray(List<String> ccList) {
        String[] cc = new String[ccList.size()];

        for (int i = 0; i < ccList.size(); i++) {
            cc[i] = ccList.get(i);
        }
        return cc;
    }
}

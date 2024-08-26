package org.lididimi.quize.controller;

import jakarta.mail.MessagingException;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.lididimi.quize.model.dto.email.EmailDTO;
import org.lididimi.quize.model.dto.password.ResetPasswordDTO;
import org.lididimi.quize.model.response.SuccessResponse;
import org.lididimi.quize.service.AuthService;
import org.lididimi.quize.service.PasswordService;
import org.lididimi.quize.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/password")
@AllArgsConstructor
public class PasswordResetController {

    private final UserService userService;
    private final AuthService authService;
    private final PasswordService passwordService;

    @PostMapping("/forgot")
    public ResponseEntity<?> forgotPassword(@RequestBody @Valid EmailDTO emailDTO, BindingResult bindingResult) throws MessagingException {
        if (bindingResult.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            bindingResult.getFieldErrors().forEach(error -> errors.put(error.getField(), error.getDefaultMessage()));
            return ResponseEntity.badRequest().body(errors);
        }
        SuccessResponse response = new SuccessResponse(HttpStatus.OK.value(), passwordService.forgotPassword(emailDTO), null);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/reset-token")
    public ResponseEntity<?> validateResetToken(@RequestParam String token) {
        boolean isValid = passwordService.validatePasswordResetToken(token);
        return ResponseEntity.ok(isValid);
    }

    @PostMapping("/reset")
    public ResponseEntity<?> resetPassword(@RequestBody @Valid ResetPasswordDTO resetPasswordDTO, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            bindingResult.getFieldErrors().forEach(error -> errors.put(error.getField(), error.getDefaultMessage()));
            return ResponseEntity.badRequest().body(errors);
        }

        String token = resetPasswordDTO.getToken();
        String newPassword = resetPasswordDTO.getNewPassword();

        SuccessResponse response = new SuccessResponse(HttpStatus.OK.value(), passwordService.updatePassword(token, newPassword), null);
        return ResponseEntity.ok(response);
    }
}

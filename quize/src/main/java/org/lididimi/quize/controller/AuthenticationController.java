package org.lididimi.quize.controller;

import jakarta.mail.MessagingException;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.lididimi.quize.model.dto.user.UserDTO;
import org.lididimi.quize.model.dto.user.UserLoginDTO;
import org.lididimi.quize.model.dto.user.UserRegisterByAdminDTO;
import org.lididimi.quize.model.dto.user.UserRegisterDTO;
import org.lididimi.quize.model.enums.UserRoleNameEnum;
import org.lididimi.quize.model.response.SuccessResponse;
import org.lididimi.quize.service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@AllArgsConstructor
public class AuthenticationController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody UserRegisterDTO userRegisterDTO, BindingResult bindingResult) throws MessagingException {
        if (bindingResult.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            bindingResult.getFieldErrors().forEach(error -> errors.put(error.getField(), error.getDefaultMessage()));
            return ResponseEntity.badRequest().body(errors);
        }

        UserDTO userDTO = authService.register(userRegisterDTO);
        SuccessResponse response = new SuccessResponse(HttpStatus.OK.value(), "Successfully registered.", userDTO);
        return ResponseEntity.ok(response);
    }


    @PostMapping("/register-by-admin")
    public ResponseEntity<?> registerTeacher(@Valid @RequestBody UserRegisterByAdminDTO userRegisterDTO, BindingResult bindingResult) throws MessagingException {
        if (bindingResult.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            bindingResult.getFieldErrors().forEach(error -> errors.put(error.getField(), error.getDefaultMessage()));
            return ResponseEntity.badRequest().body(errors);
        }

        UserDTO userDTO = authService.registerByAdmin(userRegisterDTO, UserRoleNameEnum.TEACHER);
        return ResponseEntity.ok(userDTO);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody UserLoginDTO userLoginDTO, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            bindingResult.getFieldErrors().forEach(error -> errors.put(error.getField(), error.getDefaultMessage()));
            return ResponseEntity.badRequest().body(errors);
        }
        SuccessResponse response = new SuccessResponse(HttpStatus.OK.value(), "Successfully logged in.", authService.login(userLoginDTO));

        return ResponseEntity.ok(response);
    }
}

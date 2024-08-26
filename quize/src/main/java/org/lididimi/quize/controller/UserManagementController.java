package org.lididimi.quize.controller;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.lididimi.quize.constants.QuizConstants;
import org.lididimi.quize.model.dto.user.UserChangePasswordDTO;
import org.lididimi.quize.model.dto.user.UserDTO;
import org.lididimi.quize.model.dto.user.UserUpdateDTO;
import org.lididimi.quize.model.dto.user.UserUpdateStatusDTO;
import org.lididimi.quize.model.response.SuccessResponse;
import org.lididimi.quize.service.UserService;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/users")
@AllArgsConstructor
public class UserManagementController {

    private final UserService userService;

    @GetMapping("/get")
    public ResponseEntity<Map<String, Object>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "") String search) {

        Page<UserDTO> userPage = userService.getAllUsers(page, size, search);

        Map<String, Object> response = new HashMap<>();
        response.put("users", userPage.getContent());
        response.put("currentPage", userPage.getNumber());
        response.put("totalItems", userPage.getTotalElements());
        response.put("totalPages", userPage.getTotalPages());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Long id) {
        UserDTO userDTO = userService.findUserById(id);
        return ResponseEntity.ok(userDTO);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @Valid @RequestBody UserUpdateDTO userUpdateDTO,  BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            bindingResult.getFieldErrors().forEach(error -> errors.put(error.getField(), error.getDefaultMessage()));
            return ResponseEntity.badRequest().body(errors);
        }

        userService.updateUser(id, userUpdateDTO);
        return ResponseEntity.ok("User updated successfully");
    }


    @PostMapping("/update-status")
    public ResponseEntity<?> updateUserStatus(@Valid @RequestBody UserUpdateStatusDTO userUpdateStatusDTO, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            bindingResult.getFieldErrors().forEach(error -> errors.put(error.getField(), error.getDefaultMessage()));
            return ResponseEntity.badRequest().body(errors);
        }

        String responseMessage = userService.updateStatus(userUpdateStatusDTO);
        return ResponseEntity.ok(new SuccessResponse(HttpStatus.OK.value(), responseMessage));
    }

    @PostMapping("/changePassword")
    public ResponseEntity<?> changePassword(@RequestBody @Valid UserChangePasswordDTO userChangePasswordDTO, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            bindingResult.getFieldErrors().forEach(error -> errors.put(error.getField(), error.getDefaultMessage()));
            return ResponseEntity.badRequest().body(errors);
        }

        SuccessResponse response = new SuccessResponse(HttpStatus.OK.value(), userService.changePassword(userChangePasswordDTO), null);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<SuccessResponse> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok(new SuccessResponse(HttpStatus.OK.value(), QuizConstants.USER_DELETE_SUCCESS));
    }

}


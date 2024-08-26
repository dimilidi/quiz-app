package org.lididimi.quize.model.dto.user;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UserChangePasswordDTO {
    private Long id;

    @NotNull(message = "Old password is required")
    @NotBlank(message = "Old password is required")
    private String oldPassword;

    @NotNull(message = "New password is required")
    @NotBlank(message = "New password is required")
    private String newPassword;

    @NotNull(message = "Confirm password is required")
    @NotBlank(message = "Confirm password is required")
    private String confirmPassword;
}

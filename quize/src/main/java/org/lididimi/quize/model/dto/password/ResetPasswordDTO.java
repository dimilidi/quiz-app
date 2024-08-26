package org.lididimi.quize.model.dto.password;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;


@Data
public class ResetPasswordDTO {
    @NotNull(message = "Token required")
    @NotBlank(message = "Token required")
    private String token;

    @NotNull(message = "New Password required")
    @NotBlank(message = "New Password required")
    private String newPassword;
}

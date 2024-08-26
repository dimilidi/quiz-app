package org.lididimi.quize.model.dto.user;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.lididimi.quize.model.enums.UserRoleNameEnum;

@Data
public class UserUpdateDTO {
    @NotBlank(message = "Name is required")
    @NotNull(message = "Name is required")
    private String name;

    @NotBlank(message = "Email is required")
    @NotNull(message = "Email is required")
    private String email;

    @NotBlank(message = "Contact number is required")
    @NotNull(message = "Contact number is required")
    private String contactNumber;

    @NotNull(message = "Role number is required")
    private UserRoleNameEnum role;
}

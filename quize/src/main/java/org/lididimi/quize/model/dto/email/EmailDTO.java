package org.lididimi.quize.model.dto.email;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class EmailDTO {

    @Email(message = "Invalid email format")
    @NotBlank(message = "Email is required")
    @NotNull(message = "Email is required")
    private String email;

}
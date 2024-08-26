package org.lididimi.quize.model.dto.user;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.lididimi.quize.model.enums.StatusNameEnum;

@Data
public class UserUpdateStatusDTO {
    @NotNull(message = "User ID is required")
    private Long id;

    @NotNull(message = "Status is required")
    private StatusNameEnum status;
}

package org.lididimi.quize.model.dto.user;

import jakarta.transaction.Transactional;
import lombok.Data;
import org.lididimi.quize.model.dto.role.RoleDTO;
import org.lididimi.quize.model.entity.Role;
import org.lididimi.quize.model.enums.StatusNameEnum;
import org.lididimi.quize.model.enums.UserRoleNameEnum;

import java.util.ArrayList;
import java.util.List;

@Data
public class UserDTO {
    private Long id;

    private String name;

    private String email;

    private String contactNumber;

    private StatusNameEnum status;

    private List<UserRoleNameEnum> roles;

    public UserDTO() {}

    public UserDTO(Long id, String name, String email, String contactNumber, StatusNameEnum status, List<UserRoleNameEnum> roles) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.contactNumber = contactNumber;
        this.roles = roles;
    }
}

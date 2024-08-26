package org.lididimi.quize.service;

import jakarta.mail.MessagingException;
import org.lididimi.quize.model.dto.user.UserDTO;
import org.lididimi.quize.model.dto.user.UserLoginDTO;
import org.lididimi.quize.model.dto.user.UserRegisterByAdminDTO;
import org.lididimi.quize.model.dto.user.UserRegisterDTO;
import org.lididimi.quize.model.enums.UserRoleNameEnum;

public interface AuthService {
    UserDTO register(UserRegisterDTO userRegisterDTO) throws MessagingException;

    UserDTO registerByAdmin(UserRegisterByAdminDTO userRegisterDTO, UserRoleNameEnum roleName) throws MessagingException;

    String login(UserLoginDTO userLoginDTO);

}

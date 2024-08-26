package org.lididimi.quize.service;

import org.lididimi.quize.model.dto.user.UserChangePasswordDTO;
import org.lididimi.quize.model.dto.user.UserDTO;
import org.lididimi.quize.model.dto.user.UserUpdateDTO;
import org.lididimi.quize.model.dto.user.UserUpdateStatusDTO;
import org.springframework.data.domain.Page;

import java.util.List;


public interface UserService {

    Page<UserDTO> getAllUsers(int page, int size, String search);

    String updateStatus(UserUpdateStatusDTO userUpdateStatusDTO);

    String changePassword(UserChangePasswordDTO userChangePasswordDTO);

    UserDTO findUserById(Long id);

    void updateUser(Long id, UserUpdateDTO userUpdateDTO);

    void deleteUser(Long id);
}

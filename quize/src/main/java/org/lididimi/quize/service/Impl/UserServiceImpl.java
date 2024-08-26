package org.lididimi.quize.service.Impl;

import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.lididimi.quize.constants.QuizConstants;
import org.lididimi.quize.exception.common.ObjectNotFoundException;
import org.lididimi.quize.exception.user.BadCredentialsException;
import org.lididimi.quize.exception.user.InvalidException;
import org.lididimi.quize.exception.user.MissingException;
import org.lididimi.quize.model.dto.user.UserChangePasswordDTO;
import org.lididimi.quize.model.dto.user.UserDTO;
import org.lididimi.quize.model.dto.user.UserUpdateDTO;
import org.lididimi.quize.model.dto.user.UserUpdateStatusDTO;
import org.lididimi.quize.model.entity.Quiz;
import org.lididimi.quize.model.entity.Role;
import org.lididimi.quize.model.entity.User;
import org.lididimi.quize.model.enums.StatusNameEnum;
import org.lididimi.quize.model.enums.UserRoleNameEnum;
import org.lididimi.quize.repository.PasswordResetTokenRepository;
import org.lididimi.quize.repository.RoleRepository;
import org.lididimi.quize.repository.UserRepository;
import org.lididimi.quize.security.filter.JwtFilter;
import org.lididimi.quize.security.service.QuizUserDetailsService;
import org.lididimi.quize.service.UserService;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;


@Slf4j
@Service
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;
    public final QuizUserDetailsService quizUserDetailsService;
    private final PasswordEncoder passwordEncoder;
    private final JwtFilter jwtFilter;
    private final RoleRepository roleRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    //   private final EmailServiceImpl emailService;

    public UserServiceImpl(
            UserRepository userRepository,
            ModelMapper modelMapper,
            QuizUserDetailsService quizUserDetailsService,
            PasswordEncoder passwordEncoder,
            JwtFilter jwtFilter,
            //EmailServiceImpl emailService
            RoleRepository roleRepository, PasswordResetTokenRepository passwordResetTokenRepository) {
        this.userRepository = userRepository;
        this.modelMapper = modelMapper;
        this.quizUserDetailsService = quizUserDetailsService;
        this.passwordEncoder = passwordEncoder;
        this.jwtFilter = jwtFilter;
        // this.emailService = emailService;
        this.roleRepository = roleRepository;
        this.passwordResetTokenRepository = passwordResetTokenRepository;
    }

    @Override
    public Page<UserDTO> getAllUsers(int page, int size, String search) {
        if (jwtFilter.isAdmin()) {
            Pageable pageable = PageRequest.of(page, size);
            Page<User> userPage = userRepository.findByNameContainingIgnoreCase(search, pageable);

            Page<UserDTO> userDTOPage = userPage.map(this::convertToDto);

            return userDTOPage;
        } else {
            throw new BadCredentialsException(QuizConstants.UNAUTHORIZED_ACCESS);
        }
    }

    @Override
    public String updateStatus(UserUpdateStatusDTO updateStatusDTO) {
        if (jwtFilter.isAdmin()) {
            Optional<User> optionalUser = userRepository.findById(updateStatusDTO.getId());
            if (optionalUser.isPresent()) {
                User userToUpdate = optionalUser.get();
                StatusNameEnum newStatus = updateStatusDTO.getStatus();

                // Use the new method to check for active admin constraints
                checkMinimumActiveAdmins(userToUpdate, newStatus);

                // Update the user's status
                userRepository.updateStatus(newStatus, updateStatusDTO.getId());
                sendMailToAllAdmins(newStatus, userToUpdate.getEmail(), userRepository.getAllAdmins(UserRoleNameEnum.ADMIN));
                return QuizConstants.USER_UPDATE_SUCCESS;
            } else {
                throw new ObjectNotFoundException(QuizConstants.USER_NOT_FOUND);
            }
        } else {
            throw new BadCredentialsException(QuizConstants.UNAUTHORIZED_ACCESS);
        }
    }



    @Override
    public String changePassword(UserChangePasswordDTO userChangePasswordDTO) {
        Optional<User> optionalUser = userRepository.findByEmail(jwtFilter.currentUser());
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            if (passwordEncoder.matches(userChangePasswordDTO.getOldPassword(), user.getPassword())) {
                user.setPassword(passwordEncoder.encode(userChangePasswordDTO.getNewPassword()));
                userRepository.save(user);
                return QuizConstants.PASSWORD_UPDATE_SUCCESS;
            } else {
                throw new BadCredentialsException(QuizConstants.INCORRECT_OLD_PASSWORD);
            }
        } else {
            throw new ObjectNotFoundException(QuizConstants.USER_NOT_FOUND);
        }
    }

    @Override
    public UserDTO findUserById(Long id) {
        if (id == null || id <= 0) {
            throw new InvalidException(QuizConstants.INVALID_DATA);
        }

        Optional<User> userOptional = userRepository.findById(id);

        if (!userOptional.isPresent()) {
            throw new MissingException(QuizConstants.USER_NOT_FOUND);
        }

        User user = userOptional.get();

        return convertToDto(user);
    }

    @Override
    public void updateUser(Long id, UserUpdateDTO userUpdateDTO) {
        User existingUser = userRepository.findById(id).orElseThrow(() -> new MissingException(QuizConstants.USER_NOT_FOUND));

        if (userUpdateDTO.getName() != null) {
            existingUser.setName(userUpdateDTO.getName());
        }
        if (userUpdateDTO.getEmail() != null) {
            existingUser.setEmail(userUpdateDTO.getEmail());
        }
        if (userUpdateDTO.getContactNumber() != null) {
            existingUser.setContactNumber(userUpdateDTO.getContactNumber());
        }
        if (userUpdateDTO.getRole() != null) {
            UserRoleNameEnum roleName = userUpdateDTO.getRole();
            Optional<Role> roleOptional = roleRepository.findByName(roleName);
            roleOptional.ifPresent(role -> existingUser.setRoles(List.of(role)));
        }
        existingUser.setStatus(StatusNameEnum.ACTIVE);

        userRepository.save(existingUser);
    }

    @Override
    @Transactional
    public void deleteUser(Long id) {
        if (jwtFilter.isAdmin()) {
            User userToDelete = userRepository.findById(id).orElseThrow(() -> new MissingException(QuizConstants.USER_NOT_FOUND));

            // Use the new method to check for active admin constraints
            checkMinimumActiveAdmins(userToDelete, StatusNameEnum.INACTIVE);

            // Proceed with the deletion
            passwordResetTokenRepository.deleteByUserId(id);
            userRepository.delete(userToDelete);
            log.info("Deleted user with ID: {}", id);
        } else {
            throw new BadCredentialsException(QuizConstants.UNAUTHORIZED_ACCESS);
        }
    }




    private UserDTO convertToDto(User user) {
        List<UserRoleNameEnum> userRoleNameEnumList = user.getRoles().stream().map(Role::getName).toList();

        UserDTO userDTO = modelMapper.map(user, UserDTO.class);
        userDTO.setRoles(userRoleNameEnumList);
        return userDTO;
    }

    private void sendMailToAllAdmins(StatusNameEnum status, String user, List<String> allAdmins) {
        log.info("Send mail to all admins");
        allAdmins.remove(jwtFilter.currentUser());

       /* if (status != null && status.equals(StatusNameEnum.ACTIVE)) {
            emailService.sendSimpleMessage(jwtFilter.currentUser(), "Account approved.", "User: " + user + "\nis approved by\nAdmin: " + jwtFilter.currentUser(), allAdmins);
        } else {
            emailService.sendSimpleMessage(jwtFilter.currentUser(), "Account disabled.", "User: " + user + "\nis disabled by\nAdmin: " + jwtFilter.currentUser(), allAdmins);
        }*/
    }

    private void checkMinimumActiveAdmins(User userToCheck, StatusNameEnum newStatus) {
        // Check if the user to check is an admin
        boolean isAdminToCheck = userToCheck.getRoles().stream()
                .anyMatch(role -> role.getName().equals(UserRoleNameEnum.ADMIN));

        if (isAdminToCheck && newStatus.equals(StatusNameEnum.INACTIVE)) {
            // Check if there are any other active admins left
            long activeAdminsCount = userRepository.countByRolesNameAndStatus(UserRoleNameEnum.ADMIN, StatusNameEnum.ACTIVE);

            if (activeAdminsCount <= 1) {
                throw new InvalidException(QuizConstants.ADMIN_UPDATE_INVALID);
            }
        }
    }


}



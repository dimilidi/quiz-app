package org.lididimi.quize.repository;

import org.lididimi.quize.model.entity.Role;
import org.lididimi.quize.model.enums.UserRoleNameEnum;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByName(UserRoleNameEnum user);
}

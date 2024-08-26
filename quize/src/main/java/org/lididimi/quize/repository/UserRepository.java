package org.lididimi.quize.repository;


import jakarta.transaction.Transactional;
import org.lididimi.quize.model.entity.User;
import org.lididimi.quize.model.enums.StatusNameEnum;
import org.lididimi.quize.model.enums.UserRoleNameEnum;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    @Query("SELECT u FROM User u JOIN u.roles r WHERE r.name = :roleName")
    List<User> getAllUsers(@Param("roleName") UserRoleNameEnum roleName);


    @Query("SELECT u.email FROM User u JOIN u.roles r WHERE r.name = :roleName")
    List<String> getAllAdmins(@Param("roleName") UserRoleNameEnum roleName);


    @Transactional
    @Modifying
    @Query("UPDATE User u SET u.status=:status WHERE u.id=:id")
    Integer updateStatus(@Param("status") StatusNameEnum status, @Param("id") Long id);


    boolean existsByEmail(String email);


    Page<User> findByNameContainingIgnoreCase(String name, Pageable pageable);
}

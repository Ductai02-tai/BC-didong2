package com.nguyentranductai.banbanhtam.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.nguyentranductai.banbanhtam.model.ERole;
import com.nguyentranductai.banbanhtam.model.Role;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByName(ERole name);
}

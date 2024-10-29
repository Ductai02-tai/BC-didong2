package com.nguyentranductai.banbanhtam.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.nguyentranductai.banbanhtam.model.AppUser;

import java.util.Optional;

public interface AppUserRepository extends JpaRepository<AppUser, Integer> {
    Optional<AppUser> findByUsername(String username);

    Boolean existsByUsername(String username);
}
package com.nguyentranductai.banbanhtam.controller;

import com.nguyentranductai.banbanhtam.entity.UserProfile;
import com.nguyentranductai.banbanhtam.security.services.UserProfileService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/profile")
public class UserProfileController {
    @Autowired
    private UserProfileService userProfileService;

    @GetMapping("/{id}")
    public ResponseEntity<UserProfile> getProfile(@PathVariable Long id) {
        Optional<UserProfile> profile = userProfileService.getProfile(id);
        return profile.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<UserProfile> createProfile(@RequestBody UserProfile profile) {
        return ResponseEntity.ok(userProfileService.saveProfile(profile));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserProfile> updateProfile(@PathVariable Long id, @RequestBody UserProfile profile) {
        Optional<UserProfile> existingProfile = userProfileService.getProfile(id);
        if (existingProfile.isPresent()) {
            profile.setId(id);
            return ResponseEntity.ok(userProfileService.saveProfile(profile));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProfile(@PathVariable Long id) {
        userProfileService.deleteProfile(id);
        return ResponseEntity.noContent().build();
    }
}
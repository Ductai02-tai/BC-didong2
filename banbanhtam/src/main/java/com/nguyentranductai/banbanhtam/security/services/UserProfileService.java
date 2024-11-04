package com.nguyentranductai.banbanhtam.security.services;

import com.nguyentranductai.banbanhtam.entity.UserProfile;
import com.nguyentranductai.banbanhtam.repository.UserProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserProfileService {
    @Autowired
    private UserProfileRepository userProfileRepository;

    public Optional<UserProfile> getProfile(Long id) {
        return userProfileRepository.findById(id);
    }

    public UserProfile saveProfile(UserProfile profile) {
        return userProfileRepository.save(profile);
    }

    public void deleteProfile(Long id) {
        userProfileRepository.deleteById(id);
    }
}
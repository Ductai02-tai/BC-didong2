package com.nguyentranductai.banbanhtam.controller;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nguyentranductai.banbanhtam.dto.LoginDto;
import com.nguyentranductai.banbanhtam.model.ERole;
import com.nguyentranductai.banbanhtam.model.Role;
import com.nguyentranductai.banbanhtam.model.User;
import com.nguyentranductai.banbanhtam.payload.request.ChangePasswordRequest;
import com.nguyentranductai.banbanhtam.payload.request.LoginRequest;
import com.nguyentranductai.banbanhtam.payload.request.SignupRequest;
import com.nguyentranductai.banbanhtam.payload.response.JwtResponse;
import com.nguyentranductai.banbanhtam.payload.response.MessageResponse;
import com.nguyentranductai.banbanhtam.repository.RoleRepository;
import com.nguyentranductai.banbanhtam.repository.UserRepository;
import com.nguyentranductai.banbanhtam.security.jwt.JwtUtils;
import com.nguyentranductai.banbanhtam.security.services.UserDetailsImpl;
import com.nguyentranductai.banbanhtam.payload.request.EmailRequest; // Thêm import này
import com.nguyentranductai.banbanhtam.payload.request.OtpRequest; // Thêm import này
import com.nguyentranductai.banbanhtam.payload.request.ResetPasswordRequest;
import com.nguyentranductai.banbanhtam.security.services.EmailService; // Thêm import này
import com.nguyentranductai.banbanhtam.security.services.OtpService; // Thêm import này

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    AuthenticationManager authenticationManager;
    @Autowired
    UserRepository userRepository;
    @Autowired
    RoleRepository roleRepository;
    @Autowired
    PasswordEncoder encoder;
    @Autowired
    JwtUtils jwtUtils;
    @Autowired
    private OtpService otpService; // Thêm
    @Autowired
    private EmailService emailService; // Thêm

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());
        return ResponseEntity.ok(new JwtResponse(jwt,
                userDetails.getId(),
                userDetails.getUsername(),
                userDetails.getEmail(),
                roles));
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Username is already taken!"));
        }
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Email is already in use!"));
        }
        // Create new user's account
        User user = new User(signUpRequest.getUsername(),
                signUpRequest.getEmail(),
                encoder.encode(signUpRequest.getPassword()));
        Set<String> strRoles = signUpRequest.getRole();
        Set<Role> roles = new HashSet<>();
        if (strRoles == null) {
            Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                    .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            roles.add(userRole);
        } else {
            strRoles.forEach(role -> {
                switch (role) {
                    case "admin":
                        Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(adminRole);
                        break;
                    case "mod":
                        Role modRole = roleRepository.findByName(ERole.ROLE_MODERATOR)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(modRole);
                        break;
                    default:
                        Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(userRole);
                }
            });
        }
        user.setRoles(roles);
        userRepository.save(user);
        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }

    @PostMapping("login")
    public ResponseEntity<String> login(@RequestBody LoginDto loginDto) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginDto.getUsername(), loginDto.getPassword()));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String response = "You have successfully logged in!";
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
//
@PostMapping("/change-password")
public ResponseEntity<?> changePassword(@Valid @RequestBody ChangePasswordRequest changePasswordRequest) {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
    User user = userRepository.findByUsername(userDetails.getUsername())
                              .orElseThrow(() -> new RuntimeException("Error: User not found."));

 
    if (!encoder.matches(changePasswordRequest.getCurrentPassword(), user.getPassword())) {
        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(new MessageResponse("Error: Current password is incorrect."));
    }

 
    user.setPassword(encoder.encode(changePasswordRequest.getNewPassword()));
    userRepository.save(user);

    return ResponseEntity.ok(new MessageResponse("Password changed successfully!"));
}
//
@PostMapping("/request-otp")
public ResponseEntity<?> requestOtp(@RequestBody EmailRequest request) {
    String otp = otpService.generateOtp(request.getEmail());
    emailService.sendOtpEmail(request.getEmail(), otp);
    return ResponseEntity.ok("OTP đã được gửi về email của bạn.");
}

@PostMapping("/verify-otp")
public ResponseEntity<?> verifyOtp(@RequestBody OtpRequest request) {
    boolean isValidOtp = otpService.validateOtp(request.getEmail(), request.getOtp());
    if (isValidOtp) {
        return ResponseEntity.ok("Mã OTP hợp lệ.");
    } else {
        return ResponseEntity.badRequest().body("Mã OTP không hợp lệ hoặc đã hết hạn.");
    }
}
//
@PostMapping("/reset-password")
public ResponseEntity<?> resetPassword(@Valid @RequestBody ResetPasswordRequest resetPasswordRequest) {
    // Kiểm tra xem email có tồn tại không
    User user = userRepository.findByEmail(resetPasswordRequest.getEmail())
            .orElseThrow(() -> new RuntimeException("Error: User not found."));

    // Kiểm tra mã OTP
    boolean isValidOtp = otpService.validateOtp(resetPasswordRequest.getEmail(), resetPasswordRequest.getOtp());
    if (!isValidOtp) {
        return ResponseEntity.badRequest().body(new MessageResponse("Error: Invalid or expired OTP."));
    }

    // Cập nhật mật khẩu
    user.setPassword(encoder.encode(resetPasswordRequest.getNewPassword()));
    userRepository.save(user);

    return ResponseEntity.ok(new MessageResponse("Password reset successfully!"));
}

}
package org.example.crmdemo.services;

import lombok.RequiredArgsConstructor;
import org.example.crmdemo.configs.PasswordEncoderConfiguration;
import org.example.crmdemo.dto.auth.AuthRequestDto;
import org.example.crmdemo.dto.auth.AuthResponseDto;
import org.example.crmdemo.dto.auth.GenerationRequestDto;
import org.example.crmdemo.entities.Manager;
import org.example.crmdemo.enums.Role;
import org.example.crmdemo.repositories.ManagerRepository;
import org.example.crmdemo.utilities.JwtUtility;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final AuthenticationManager authenticationManager;
    private final ManagerService managerService;
    private final ManagerRepository managerRepository;
    private final JwtUtility jwtUtility;
    private final PasswordEncoderConfiguration PasswordEncoderConfig;

    public AuthResponseDto authenticate(AuthRequestDto authRequestDto) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        authRequestDto.getEmail(),
                        authRequestDto.getPassword())
        );

        if (!authentication.isAuthenticated()) {
            throw new RuntimeException("Invalid credentials");
        }

        Manager manager = managerRepository.findByEmail(authRequestDto.getEmail())
                .orElseThrow(() -> new RuntimeException("Manager not found"));

        if (Boolean.TRUE.equals(manager.getIsBanned())) {
            throw new RuntimeException("Manager banned");
        }

        manager.setLastLogIn(LocalDateTime.now());
        managerRepository.save(manager);

        UserDetails userDetails = managerService.loadUserByUsername(authRequestDto.getEmail());
        String accessToken = jwtUtility.generateAccessToken(userDetails);
        String refreshToken = jwtUtility.generateRefreshToken(userDetails);

        return AuthResponseDto.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .name(manager.getName())
                .role(manager.getRole())
                .build();
    }

    public AuthResponseDto refreshToken(String refreshToken) {
        if (refreshToken == null || refreshToken.trim().isEmpty()) {
            throw new IllegalArgumentException("No refresh token");
        }

        if (jwtUtility.isTokenExpired(refreshToken)) {
            throw new RuntimeException("Refresh token expired");
        }

        String email = jwtUtility.extractUsername(refreshToken);
        UserDetails userDetails = managerService.loadUserByUsername(email);

        String newAccessToken = jwtUtility.generateAccessToken(userDetails);
        String newRefreshToken = jwtUtility.generateRefreshToken(userDetails);

        Manager manager = managerRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Manager not found"));

        return AuthResponseDto.builder()
                .accessToken(newAccessToken)
                .refreshToken(newRefreshToken)
                .name(manager.getName())
                .role(manager.getRole())
                .build();
    }

    public String generateTokenForPassword(Long managerId, String token) {
        String email = jwtUtility.extractUsername(token);
        Manager admin = managerRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        if (admin.getRole() != Role.ROLE_ADMIN) {
            throw new RuntimeException("Only admin can activate managers");
        }

        Manager manager = managerRepository.findById(managerId)
                .orElseThrow(() -> new RuntimeException("Manager not found"));

        UserDetails userDetails = managerService.loadUserByUsername(manager.getEmail());
        return jwtUtility.generateAccessToken(userDetails);
    }

    public void setPassword(String token, GenerationRequestDto dto) {
        if (!dto.getPassword().equals(dto.getConfirmPassword())) {
            throw new RuntimeException("Passwords do not match");
        }

        String email = jwtUtility.extractUsername(token);

        Manager manager = managerRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Manager not found"));

        String encodedPassword = PasswordEncoderConfig.passwordEncoder().encode(dto.getPassword());

        if (Boolean.TRUE.equals(manager.getIsActive())) {
            manager.setPassword(encodedPassword);
        } else {
            manager.setPassword(encodedPassword);
            manager.setIsActive(true);
        }
        managerRepository.save(manager);
    }
}
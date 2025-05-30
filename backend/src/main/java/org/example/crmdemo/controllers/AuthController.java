package org.example.crmdemo.controllers;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.crmdemo.dto.auth.AuthRequestDto;
import org.example.crmdemo.dto.auth.AuthResponseDto;
import org.example.crmdemo.dto.auth.GenerationRequestDto;
import org.example.crmdemo.dto.auth.RefreshTokenRequestDto;
import org.example.crmdemo.services.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/v1/api/auth")
public class AuthController {
    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDto> signIn(@RequestBody @Valid AuthRequestDto authRequestDto) {
        return new ResponseEntity<>(authService.authenticate(authRequestDto), HttpStatus.OK);
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<AuthResponseDto> getNewTokenPair(@RequestBody @Valid RefreshTokenRequestDto refreshTokenRequestDto) {
        return new ResponseEntity<>(authService.refreshToken(refreshTokenRequestDto.getRefreshToken()), HttpStatus.OK);
    }

    @PostMapping("/setPassword/id/{id}")
    public ResponseEntity<String> generateTokenForPassword(
            @PathVariable Long id,
            @RequestHeader("Authorization") String token) {
        String generationToken = authService.generateTokenForPassword(id, token.replace("Bearer ", ""));
        return new ResponseEntity<>(generationToken, HttpStatus.OK);
    }

    @PostMapping("/setPassword/{token}")
    public ResponseEntity<Void> setPassword(
            @PathVariable String token,
            @RequestBody GenerationRequestDto generationRequestDto) {
        authService.setPassword(token, generationRequestDto);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
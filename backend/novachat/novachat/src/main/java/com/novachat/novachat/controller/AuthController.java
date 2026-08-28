package com.novachat.novachat.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.novachat.novachat.dto.LoginRequest;
import com.novachat.novachat.dto.LoginResponse;
import com.novachat.novachat.dto.RefreshTokenRequest;
import com.novachat.novachat.service.AuthService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

	private final AuthService authService;

	public AuthController(AuthService authService) {
		this.authService = authService;
	}

	@PostMapping("/login")
	public LoginResponse login(@Valid @RequestBody LoginRequest request) {

		return authService.login(request);
	}

	@PostMapping("/refresh")
	public LoginResponse refresh(@Valid @RequestBody RefreshTokenRequest request) {

		return authService.refresh(request);
	}

	@PostMapping("/logout")
	public ResponseEntity<Void> logout(@Valid @RequestBody RefreshTokenRequest request) {

		authService.logout(request);

		return ResponseEntity.noContent().build();
	}
}
package com.novachat.novachat.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.novachat.novachat.config.JwtProperties;
import com.novachat.novachat.dto.LoginRequest;
import com.novachat.novachat.dto.LoginResponse;
import com.novachat.novachat.dto.RefreshTokenRequest;
import com.novachat.novachat.model.User;
import com.novachat.novachat.repository.UserRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;
	private final JwtService jwtService;
	private final RefreshTokenService refreshTokenService;
	private final JwtProperties jwtProperties;

	public LoginResponse login(LoginRequest request) {

		User user = userRepository.findByEmail(request.email())
				.orElseThrow(() -> new IllegalArgumentException("Invalid username or password"));

		if (!passwordEncoder.matches(request.password(), user.getPassword())) {

			throw new IllegalArgumentException("Invalid username or password");
		}

		String accessToken = jwtService.generateToken(user);
		String refreshToken = refreshTokenService.createRefreshToken(user);
		Long expiresIn = jwtProperties.getAccessTokenExpiration() / 1000;

		return new LoginResponse(accessToken, refreshToken, "Bearer", expiresIn);
	}

	@Transactional
	public LoginResponse refresh(RefreshTokenRequest request) {

		User user = refreshTokenService.validateAndGetUser(request.refreshToken());

		refreshTokenService.revokeToken(request.refreshToken());

		String accessToken = jwtService.generateToken(user);
		String newRefreshToken = refreshTokenService.createRefreshToken(user);
		Long expiresIn = jwtProperties.getAccessTokenExpiration() / 1000;

		return new LoginResponse(accessToken, newRefreshToken, "Bearer", expiresIn);
	}

	@Transactional
	public void logout(RefreshTokenRequest request) {
		refreshTokenService.revokeToken(request.refreshToken());
	}
}
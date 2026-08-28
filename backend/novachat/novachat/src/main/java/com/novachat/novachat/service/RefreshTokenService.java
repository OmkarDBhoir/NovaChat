package com.novachat.novachat.service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Instant;
import java.util.Base64;
import java.util.HexFormat;

import org.springframework.stereotype.Service;

import com.novachat.novachat.config.JwtProperties;
import com.novachat.novachat.model.RefreshToken;
import com.novachat.novachat.model.User;
import com.novachat.novachat.repository.RefreshTokenRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {

	private final RefreshTokenRepository refreshTokenRepository;
	private final JwtProperties jwtProperties;

	private final SecureRandom secureRandom = new SecureRandom();

	@Transactional
	public String createRefreshToken(User user) {

		byte[] randomBytes = new byte[64];
		secureRandom.nextBytes(randomBytes);

		String rawToken = Base64.getUrlEncoder().withoutPadding().encodeToString(randomBytes);

		String tokenHash = hashToken(rawToken);

		RefreshToken refreshToken = RefreshToken.builder().user(user).tokenHash(tokenHash)
				.expiresAt(Instant.now().plusMillis(jwtProperties.getRefreshTokenExpiration())).createdAt(Instant.now())
				.build();

		refreshTokenRepository.save(refreshToken);

		return rawToken;
	}

	@Transactional
	public User validateAndGetUser(String rawToken) {

		String tokenHash = hashToken(rawToken);

		RefreshToken refreshToken = refreshTokenRepository.findByTokenHash(tokenHash)
				.orElseThrow(() -> new IllegalArgumentException("Invalid refresh token"));

		if (refreshToken.isRevoked()) {
			throw new IllegalArgumentException("Refresh token has been revoked");
		}

		if (refreshToken.isExpired()) {
			throw new IllegalArgumentException("Refresh token has expired");
		}

		return refreshToken.getUser();
	}

	@Transactional
	public void revokeToken(String rawToken) {

		String tokenHash = hashToken(rawToken);

		refreshTokenRepository.findByTokenHash(tokenHash).ifPresent(refreshToken -> {
			refreshToken.setRevokedAt(Instant.now());
			refreshTokenRepository.save(refreshToken);
		});
	}

	private String hashToken(String token) {
		try {

			MessageDigest digest = MessageDigest.getInstance("SHA-256");

			byte[] hash = digest.digest(token.getBytes(StandardCharsets.UTF_8));

			return HexFormat.of().formatHex(hash);

		} catch (NoSuchAlgorithmException e) {
			throw new IllegalStateException("SHA-256 algorithm not available", e);
		}
	}
}

package com.novachat.novachat.service;

import java.nio.charset.StandardCharsets;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.stereotype.Service;

import com.novachat.novachat.config.JwtProperties;
import com.novachat.novachat.model.User;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

	private final JwtProperties jwtProperties;
	private final SecretKey secretKey;

	public JwtService(JwtProperties jwtProperties) {
		this.jwtProperties = jwtProperties;
		this.secretKey = Keys.hmacShaKeyFor(jwtProperties.getSecret().getBytes(StandardCharsets.UTF_8));
	}

	public String generateToken(User user) {

		Date now = new Date();

		Date expiration = new Date(now.getTime() + jwtProperties.getAccessTokenExpiration());

		return Jwts.builder().issuer(jwtProperties.getIssuer()).subject(user.getUsername())
				.claim("userId", user.getId().toString()).issuedAt(now).expiration(expiration).signWith(secretKey)
				.compact();
	}

	public String extractUsername(String token) {
		return parseToken(token).getSubject();
	}

	public boolean isValidToken(String token) {
		try {

			parseToken(token);
			return true;
		} catch (Exception e) {
			return false;
		}
	}

	private Claims parseToken(String token) {
		return Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload();
	}
}

package com.novachat.novachat.dto;

import java.time.Instant;
import java.util.UUID;

import com.novachat.novachat.model.User;

public record UserResponse(UUID id, String username, String email, String status, Instant createdAt) {

	public static UserResponse from(User user) {
		return new UserResponse(user.getId(), user.getUsername(), user.getEmail(), user.getStatus(),
				user.getCreatedAt());
	}
}
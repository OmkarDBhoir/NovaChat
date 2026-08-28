package com.novachat.novachat.dto;

import java.util.UUID;

import com.novachat.novachat.constant.AccountStatus;
import com.novachat.novachat.model.User;

public record UserSearchResponse(UUID id, String username, AccountStatus status) {
	
	public static UserSearchResponse from(User user) {
		return new UserSearchResponse(user.getId(), user.getUsername(), user.getStatus());
	}
}
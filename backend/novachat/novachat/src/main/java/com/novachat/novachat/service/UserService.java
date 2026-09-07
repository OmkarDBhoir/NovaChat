package com.novachat.novachat.service;

import java.util.List;
import java.util.UUID;

import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.novachat.novachat.dto.RegisterRequest;
import com.novachat.novachat.dto.UserResponse;
import com.novachat.novachat.dto.UserSearchResponse;
import com.novachat.novachat.model.User;
import com.novachat.novachat.repository.UserRepository;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class UserService {

	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;

	public UserResponse register(RegisterRequest request) {

		if (userRepository.existsByUsername(request.username())) {
			throw new IllegalArgumentException("Username already exists");
		}

		if (userRepository.existsByEmail(request.email())) {
			throw new IllegalArgumentException("Email already exists");
		}

		User user = new User();

		user.setUsername(request.username());
		user.setEmail(request.email());
		user.setPassword(passwordEncoder.encode(request.password()));

		User savedUser = userRepository.save(user);

		return UserResponse.from(savedUser);
	}

	public User getUser(String username) {

		User user = userRepository.findByUsername(username)
				.orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));

		return user;
	}

	public UUID getUserIdByUsername(String username) {

		User user = getUser(username);

		return user.getId();
	}

	public UserResponse getCurrentUser(String username) {

		User user = getUser(username);

		return UserResponse.from(user);
	}

	public List<UserSearchResponse> searchUsers(String query, String currentUsername) {
		return userRepository.findByUsernameContainingIgnoreCase(query).stream()
				.filter(user -> !user.getUsername().equalsIgnoreCase(currentUsername)).map(UserSearchResponse::from)
				.toList();
	}

	public List<UserSearchResponse> searchUsers(String query, UUID currentUserId) {

		if (query == null || query.isBlank()) {
			return List.of();
		}

		return userRepository.findTop20ByUsernameContainingIgnoreCase(query.trim()).stream()
				.filter(user -> !user.getId().equals(currentUserId)).map(UserSearchResponse::from).toList();
	}

}

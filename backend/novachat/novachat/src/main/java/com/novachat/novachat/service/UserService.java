package com.novachat.novachat.service;

import org.springframework.stereotype.Service;

import com.novachat.novachat.dto.RegisterRequest;
import com.novachat.novachat.dto.UserResponse;
import com.novachat.novachat.model.User;
import com.novachat.novachat.repository.UserRepository;

@Service
public class UserService {
	
	private final UserRepository userRepository;

	public UserService(UserRepository userRepository) {
		this.userRepository = userRepository;
	}
	
	public UserResponse register(RegisterRequest request) {
		
		if(userRepository.existsByUsername(request.username())) {
			throw new IllegalArgumentException("Username already exists");
		}
		
		if(userRepository.existsByEmail(request.email())) {
			throw new IllegalArgumentException("Email already exists");
		}
		
		User user = new User();
		
		user.setUsername(request.username());
		user.setEmail(request.email());
		user.setPassword(request.password());
		
		User savedUser = userRepository.save(user);
		
		return UserResponse.from(savedUser);
	}
	
	
}

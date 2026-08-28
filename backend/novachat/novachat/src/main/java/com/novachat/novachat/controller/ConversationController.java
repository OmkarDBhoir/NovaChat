package com.novachat.novachat.controller;

import java.security.Principal;
import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.novachat.novachat.dto.ConversationListResponse;
import com.novachat.novachat.dto.ConversationResponse;
import com.novachat.novachat.dto.CreateConversationRequest;
import com.novachat.novachat.service.ConversationService;
import com.novachat.novachat.service.UserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/conversations")
@RequiredArgsConstructor
public class ConversationController {

	private final ConversationService conversationService;
	private final UserService userService;

	@GetMapping
	public List<ConversationListResponse> getConversations(Principal principal) {

		UUID currentUserId = userService.getUserIdByUsername(principal.getName());

		return conversationService.getConversations(currentUserId);
	}

	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	public ConversationResponse createConversation(@Valid @RequestBody CreateConversationRequest request,
			Principal principal) {

		UUID currentUserId = userService.getUserIdByUsername(principal.getName());

		return conversationService.createDirectConversation(currentUserId, request);
	}
}

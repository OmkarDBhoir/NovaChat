package com.novachat.novachat.controller;

import java.security.Principal;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.novachat.novachat.dto.MessageResponse;
import com.novachat.novachat.dto.PageResponse;
import com.novachat.novachat.dto.SendMessageRequest;
import com.novachat.novachat.service.MessageService;
import com.novachat.novachat.service.UserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/conversations/{conversationId}/messages")
@RequiredArgsConstructor
public class MessageController {

	private final MessageService messageService;
	private final UserService userService;

	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	public MessageResponse sendMessage(@PathVariable UUID conversationId,
			@Valid @RequestBody SendMessageRequest request, Principal principal) {

		UUID currentUserId = userService.getUserIdByUsername(principal.getName());

		return messageService.sendMessage(conversationId, currentUserId, request);
	}

	@GetMapping
	public PageResponse<MessageResponse> getMessages(@PathVariable UUID conversationId,
			@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "50") int size,
			Principal principal) {

		UUID currentUserId = userService.getUserIdByUsername(principal.getName());

		return messageService.getMessages(conversationId, currentUserId, page, size);
	}
}

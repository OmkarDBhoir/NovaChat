package com.novachat.novachat.dto;

import java.time.Instant;
import java.util.UUID;

import com.novachat.novachat.constant.MessageType;
import com.novachat.novachat.model.Message;

public record MessageResponse(UUID id, UUID conversationId, UUID senderId, String senderUsername, MessageType type,
		String content, Instant createdAt, Instant updatedAt) {

	public static MessageResponse from(Message message) {

		return new MessageResponse(message.getId(), message.getConversation().getId(), message.getSender().getId(),
				message.getSender().getUsername(), message.getType(), message.getContent(), message.getCreatedAt(),
				message.getUpdatedAt());
	}
}
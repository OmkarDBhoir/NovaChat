package com.novachat.novachat.dto;

import java.time.Instant;
import java.util.UUID;

import com.novachat.novachat.constant.ConversationType;
import com.novachat.novachat.model.Conversation;

public record ConversationResponse(UUID id, ConversationType type, Instant createdAt, Instant updatedAt) {

	public static ConversationResponse from(Conversation conversation) {

		return new ConversationResponse(conversation.getId(), conversation.getType(), conversation.getCreatedAt(),
				conversation.getUpdatedAt());
	}
}
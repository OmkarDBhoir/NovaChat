package com.novachat.novachat.dto;

import java.time.Instant;
import java.util.UUID;

import com.novachat.novachat.constant.ConversationType;

public record ConversationListResponse(UUID id, ConversationType type, UUID otherUserId, String otherUsername,
		MessageResponse lastMessage, Instant updatedAt) {

}

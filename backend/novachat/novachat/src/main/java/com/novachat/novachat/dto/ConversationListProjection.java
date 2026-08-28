package com.novachat.novachat.dto;

import java.time.Instant;
import java.util.UUID;

public interface ConversationListProjection {

    UUID getConversationId();

    String getConversationType();

    UUID getOtherUserId();

    String getOtherUsername();

    UUID getLastMessageId();

    UUID getLastMessageSenderId();

    String getLastMessageSenderUsername();

    String getLastMessageType();

    String getLastMessageContent();

    Instant getLastMessageCreatedAt();

    Instant getLastMessageUpdatedAt();

    Instant getConversationUpdatedAt();
}
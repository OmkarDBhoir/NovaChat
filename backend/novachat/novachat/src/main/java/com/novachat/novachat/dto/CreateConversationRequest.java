package com.novachat.novachat.dto;

import java.util.UUID;

import jakarta.validation.constraints.NotNull;

public record CreateConversationRequest(@NotNull UUID userId) {
}
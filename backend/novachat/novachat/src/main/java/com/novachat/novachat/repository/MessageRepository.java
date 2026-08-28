package com.novachat.novachat.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.novachat.novachat.model.Message;

public interface MessageRepository extends JpaRepository<Message, UUID> {

	Page<Message> findByConversationIdOrderByCreatedAtAsc(UUID conversationId, Pageable pageable);

	Optional<Message> findTopByConversationIdOrderByCreatedAtDesc(UUID conversationId);
}
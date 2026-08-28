package com.novachat.novachat.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.novachat.novachat.model.ConversationMember;

public interface ConversationMemberRepository extends JpaRepository<ConversationMember, UUID> {

	List<ConversationMember> findByUserId(UUID userId);

	List<ConversationMember> findByConversationId(UUID conversationId);

	Optional<ConversationMember> findByConversationIdAndUserId(UUID conversationId, UUID userId);

	boolean existsByConversationIdAndUserId(UUID conversationId, UUID userId);
}
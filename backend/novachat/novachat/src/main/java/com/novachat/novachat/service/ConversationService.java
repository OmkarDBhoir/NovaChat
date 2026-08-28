package com.novachat.novachat.service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.novachat.novachat.constant.ConversationMemberRole;
import com.novachat.novachat.constant.ConversationType;
import com.novachat.novachat.dto.ConversationListResponse;
import com.novachat.novachat.dto.ConversationResponse;
import com.novachat.novachat.dto.CreateConversationRequest;
import com.novachat.novachat.dto.MessageResponse;
import com.novachat.novachat.model.Conversation;
import com.novachat.novachat.model.ConversationMember;
import com.novachat.novachat.model.User;
import com.novachat.novachat.repository.ConversationMemberRepository;
import com.novachat.novachat.repository.ConversationRepository;
import com.novachat.novachat.repository.MessageRepository;
import com.novachat.novachat.repository.UserRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ConversationService {

	private final ConversationRepository conversationRepository;
	private final ConversationMemberRepository conversationMemberRepository;
	private final UserRepository userRepository;
	private final MessageRepository messageRepository;

	@Transactional
	public ConversationResponse createDirectConversation(UUID currentUserId, CreateConversationRequest request) {

		UUID targetUserId = request.userId();

		if (currentUserId.equals(targetUserId)) {
			throw new IllegalArgumentException("You cannot create a conversation with yourself");
		}

		User currentUser = userRepository.findById(currentUserId)
				.orElseThrow(() -> new IllegalArgumentException("Current user not found"));

		User targetUser = userRepository.findById(targetUserId)
				.orElseThrow(() -> new IllegalArgumentException("Target user not found"));

		Optional<Conversation> existingConversation = conversationRepository
				.findDirectConversation(ConversationType.DIRECT, currentUserId, targetUserId);

		if (existingConversation.isPresent()) {
			return ConversationResponse.from(existingConversation.get());
		}

		Conversation conversation = Conversation.builder().type(ConversationType.DIRECT).build();

		conversationRepository.save(conversation);

		ConversationMember currentMember = ConversationMember.builder().conversation(conversation).user(currentUser)
				.role(ConversationMemberRole.MEMBER).joinedAt(java.time.Instant.now()).build();

		ConversationMember targetMember = ConversationMember.builder().conversation(conversation).user(targetUser)
				.role(ConversationMemberRole.MEMBER).joinedAt(java.time.Instant.now()).build();

		conversationMemberRepository.save(currentMember);
		conversationMemberRepository.save(targetMember);

		return ConversationResponse.from(conversation);

	}

	@Transactional
	public List<ConversationListResponse> getConversations(UUID currentUserId) {

		List<ConversationMember> memberships = conversationMemberRepository.findByUserId(currentUserId);

		return memberships.stream().map(membership -> {
			Conversation conversation = membership.getConversation();
			ConversationMember otherMember = conversationMemberRepository.findByConversationId(conversation.getId())
					.stream().filter(member -> member.getId().equals(currentUserId)).findFirst().orElse(null);
			MessageResponse lastMessage = messageRepository
					.findTopByConversationIdOrderByCreatedAtDesc(conversation.getId()).map(MessageResponse::from)
					.orElse(null);

			return new ConversationListResponse(conversation.getId(), conversation.getType(),
					otherMember != null ? otherMember.getUser().getId() : null,
					otherMember != null ? otherMember.getUser().getUsername() : null, lastMessage,
					conversation.getUpdatedAt());
		}).sorted((a, b) -> b.updatedAt().compareTo(a.updatedAt())).toList();
	}
}

package com.novachat.novachat.service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.novachat.novachat.constant.ConversationMemberRole;
import com.novachat.novachat.constant.ConversationType;
import com.novachat.novachat.constant.MessageType;
import com.novachat.novachat.dto.ConversationListProjection;
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

		return conversationRepository.findConversationList(currentUserId).stream().map(this::toConversationResponse)
				.toList();
	}

	private ConversationListResponse toConversationResponse(ConversationListProjection projection) {

		MessageResponse lastMessage = null;

		if (projection.getLastMessageId() != null) {

			lastMessage = new MessageResponse(projection.getLastMessageId(), projection.getConversationId(),
					projection.getLastMessageSenderId(), projection.getLastMessageSenderUsername(),
					MessageType.valueOf(projection.getLastMessageType()),
					projection.getLastMessageContent(), projection.getLastMessageCreatedAt(),
					projection.getLastMessageUpdatedAt());
		}

		return new ConversationListResponse(projection.getConversationId(),
				ConversationType.valueOf(projection.getConversationType()), projection.getOtherUserId(),
				projection.getOtherUsername(), lastMessage, projection.getConversationUpdatedAt());
	}
}

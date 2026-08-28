package com.novachat.novachat.service;

import java.time.Instant;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.novachat.novachat.constant.MessageType;
import com.novachat.novachat.dto.MessageResponse;
import com.novachat.novachat.dto.PageResponse;
import com.novachat.novachat.dto.SendMessageRequest;
import com.novachat.novachat.model.Conversation;
import com.novachat.novachat.model.Message;
import com.novachat.novachat.model.User;
import com.novachat.novachat.repository.ConversationMemberRepository;
import com.novachat.novachat.repository.ConversationRepository;
import com.novachat.novachat.repository.MessageRepository;
import com.novachat.novachat.repository.UserRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MessageService {

	private final MessageRepository messageRepository;
	private final ConversationRepository conversationRepository;
	private final ConversationMemberRepository conversationMemberRepository;
	private final UserRepository userRepository;

	@Transactional
	public MessageResponse sendMessage(UUID conversationId, UUID senderId, SendMessageRequest request) {

		Conversation conversation = conversationRepository.findById(conversationId)
				.orElseThrow(() -> new IllegalArgumentException("Conversation not found"));

		boolean isMember = conversationMemberRepository.existsByConversationIdAndUserId(conversationId, senderId);

		if (!isMember) {
			throw new IllegalArgumentException("You are not a member of this conversation");
		}

		User sender = userRepository.findById(senderId)
				.orElseThrow(() -> new IllegalArgumentException("User not found"));

		Message message = Message.builder().conversation(conversation).sender(sender).type(MessageType.TEXT)
				.content(request.content().trim()).build();

		Message savedMessage = messageRepository.save(message);

		conversation.setUpdatedAt(Instant.now());
		conversationRepository.save(conversation);

		return MessageResponse.from(savedMessage);
	}

	@Transactional
	public PageResponse<MessageResponse> getMessages(UUID conversationId, UUID currentUserId, int page, int size) {

		conversationRepository.findById(conversationId)
				.orElseThrow(() -> new IllegalArgumentException("Conversation not found"));

		boolean isMember = conversationMemberRepository.existsByConversationIdAndUserId(conversationId, currentUserId);

		if (!isMember) {
			throw new IllegalArgumentException("You are not a member of this conversation");
		}

		if (page < 0) {
			throw new IllegalArgumentException("Page cannot be negative");
		}

		if (size < 1 || size > 100) {
			throw new IllegalArgumentException("Page size must be between 1 and 100");
		}

		Pageable pageable = PageRequest.of(page, size);

		Page<Message> messagePage = messageRepository.findByConversationIdOrderByCreatedAtAsc(conversationId, pageable);

		return new PageResponse<MessageResponse>(messagePage.getContent().stream().map(MessageResponse::from).toList(),
				messagePage.getNumber(), messagePage.getSize(), messagePage.getTotalElements(),
				messagePage.getTotalPages(), messagePage.isFirst(), messagePage.isLast());

	}

}

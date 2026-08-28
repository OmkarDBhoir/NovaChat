package com.novachat.novachat.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.novachat.novachat.constant.ConversationType;
import com.novachat.novachat.dto.ConversationListProjection;
import com.novachat.novachat.model.Conversation;

public interface ConversationRepository extends JpaRepository<Conversation, UUID> {

	@Query("""
			    SELECT c
			    FROM Conversation c
			    JOIN ConversationMember cm1
			        ON cm1.conversation = c
			    JOIN ConversationMember cm2
			        ON cm2.conversation = c
			    WHERE c.type = :type
			      AND cm1.user.id = :user1Id
			      AND cm2.user.id = :user2Id
			""")
	Optional<Conversation> findDirectConversation(@Param("type") ConversationType type, @Param("user1Id") UUID user1Id,
			@Param("user2Id") UUID user2Id);

	@Query(value = """
			SELECT
			    c.id AS conversationId,
			    c.type AS conversationType,

			    u.id AS otherUserId,
			    u.username AS otherUsername,

			    m.id AS lastMessageId,
			    m.sender_id AS lastMessageSenderId,
			    sender.username AS lastMessageSenderUsername,
			    m.type AS lastMessageType,
			    m.content AS lastMessageContent,
			    m.created_at AS lastMessageCreatedAt,
			    m.updated_at AS lastMessageUpdatedAt,

			    c.updated_at AS conversationUpdatedAt

			FROM conversations c

			JOIN conversation_members current_member
			    ON current_member.conversation_id = c.id
			   AND current_member.user_id = :userId

			JOIN conversation_members other_member
			    ON other_member.conversation_id = c.id
			   AND other_member.user_id <> :userId

			JOIN users u
			    ON u.id = other_member.user_id

			LEFT JOIN LATERAL (
			    SELECT
			        msg.id,
			        msg.sender_id,
			        msg.type,
			        msg.content,
			        msg.created_at,
			        msg.updated_at
			    FROM messages msg
			    WHERE msg.conversation_id = c.id
			      AND msg.deleted_at IS NULL
			    ORDER BY msg.created_at DESC
			    LIMIT 1
			) m ON true

			LEFT JOIN users sender
			    ON sender.id = m.sender_id

			ORDER BY c.updated_at DESC
			""", nativeQuery = true)
	List<ConversationListProjection> findConversationList(@Param("userId") UUID userId);
}
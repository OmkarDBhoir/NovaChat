package com.novachat.novachat.model;

import java.time.Instant;
import java.util.UUID;

import com.novachat.novachat.constant.ConversationMemberRole;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "conversation_members", indexes = { @Index(name = "idx_conversation_member_user", columnList = "user_id"),
		@Index(name = "idx_conversation_member_conversation", columnList = "conversation_id") }, uniqueConstraints = {
				@UniqueConstraint(name = "uk_conversation_member", columnNames = { "conversation_id", "user_id" }) })
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ConversationMember {

	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	private UUID id;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "conversation_id", nullable = false)
	private Conversation conversation;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "user_id", nullable = false)
	private User user;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false, length = 20)
	@Builder.Default
	private ConversationMemberRole role = ConversationMemberRole.MEMBER;

	@Column(nullable = false)
	private Instant joinedAt;

	private Instant leftAt;
}
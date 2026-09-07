import type { MessageResponse } from "./message";

export type ConversationType =
    | "DIRECT";

export interface ConversationResponse {

    id: string;

    type: ConversationType;

    createdAt: string;

    updatedAt: string;
}

export interface ConversationListResponse {

    id: string;

    type: ConversationType;

    otherUserId: string;

    otherUsername: string;

    lastMessage: MessageResponse | null;

    updatedAt: string;
}

export interface CreateConversationRequest {

    userId: string;
}
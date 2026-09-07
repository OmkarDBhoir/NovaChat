export type MessageType =
    | "TEXT";

export interface MessageResponse {

    id: string;

    conversationId: string;

    senderId: string;

    senderUsername: string;

    type: MessageType;

    content: string;

    createdAt: string;

    updatedAt: string;
}

export interface SendMessageRequest {

    content: string;
}

export interface PageResponse<T> {

    content: T[];

    page: number;

    size: number;

    totalElements: number;

    totalPages: number;

    first: boolean;

    last: boolean;
}
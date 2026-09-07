import apiClient from "./axios";

import type {
    ConversationListResponse,
    ConversationResponse,
    CreateConversationRequest,
} from "../types/conversation";

export const getConversations =
    async (): Promise<ConversationListResponse[]> => {

        const response =
            await apiClient.get<ConversationListResponse[]>(
                "/api/conversations"
            );

        return response.data;
    };

export const createConversation =
    async (
        request: CreateConversationRequest
    ): Promise<ConversationResponse> => {

        const response =
            await apiClient.post<ConversationResponse>(
                "/api/conversations",
                request
            );

        return response.data;
    };
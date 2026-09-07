import apiClient from "./axios";

import type {
    MessageResponse,
    PageResponse,
    SendMessageRequest,
} from "../types/message";

export const getMessages = async (
    conversationId: string,
    page = 0,
    size = 50
): Promise<PageResponse<MessageResponse>> => {

    const response =
        await apiClient.get<PageResponse<MessageResponse>>(
            `/api/conversations/${conversationId}/messages`,
            {
                params: {
                    page,
                    size,
                },
            }
        );

    return response.data;
};

export const sendMessage = async (
    conversationId: string,
    request: SendMessageRequest
): Promise<MessageResponse> => {

    const response =
        await apiClient.post<MessageResponse>(
            `/api/conversations/${conversationId}/messages`,
            request
        );

    return response.data;
};
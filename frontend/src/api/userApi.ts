import apiClient from "./axios";
import type {
    User,
    UserSearchResult,
} from "../types/user";

export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
}

export const register = async (request: RegisterRequest): Promise<User> => {
    const response = await apiClient.post<User>("/api/users/register", request);
    return response.data;
};

export const getCurrentUser = async (): Promise<User> => {

    const response = await apiClient.get<User>(
        "/api/users/me"
    );

    return response.data;
};

export const searchUsers = async (
    query: string
): Promise<UserSearchResult[]> => {

    const response = await apiClient.get<UserSearchResult[]>(
        "/api/users/search",
        {
            params: {
                query,
            },
        }
    );

    return response.data;
};
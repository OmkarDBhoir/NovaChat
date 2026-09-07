import apiClient from "./axios";

import type {
    LoginRequest,
    LoginResponse,
    RegisterRequest,
} from "../types/auth";

export const login = async (
    request: LoginRequest
): Promise<LoginResponse> => {

    const response = await apiClient.post<LoginResponse>(
        "/api/auth/login",
        request
    );

    return response.data;
};

export const register = async (
    request: RegisterRequest
) => {

    const response = await apiClient.post(
        "/api/users/register",
        request
    );

    return response.data;
};

export const refresh = async (
    refreshToken: string
): Promise<LoginResponse> => {

    const response = await apiClient.post<LoginResponse>(
        "/api/auth/refresh",
        {
            refreshToken,
        }
    );

    return response.data;
};

export const logout = async (
    refreshToken: string
): Promise<void> => {

    await apiClient.post(
        "/api/auth/logout",
        {
            refreshToken,
        }
    );
};
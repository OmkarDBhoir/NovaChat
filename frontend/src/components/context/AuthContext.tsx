import { createContext, useContext, useEffect, useState, type ReactNode, } from "react";

import { login as loginApi, logout as logoutApi } from "../../api/authApi";
import { getCurrentUser } from "../../api/userApi";

import type { LoginRequest } from "../../types/auth";
import type { User } from "../../types/user";

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;

    login: (request: LoginRequest) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(
    undefined
);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({
    children,
}: AuthProviderProps) => {

    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const restoreSession = async () => {

            const accessToken =
                localStorage.getItem("accessToken");

            if (!accessToken) {
                setLoading(false);
                return;
            }

            try {

                const currentUser =
                    await getCurrentUser();

                setUser(currentUser);

            } catch (error) {

                console.error(
                    "Failed to restore session",
                    error
                );

                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");

            } finally {

                setLoading(false);
            }
        };

        restoreSession();

    }, []);

    const login = async (
        request: LoginRequest
    ) => {

        const response = await loginApi(request);

        localStorage.setItem(
            "accessToken",
            response.accessToken
        );

        localStorage.setItem(
            "refreshToken",
            response.refreshToken
        );

        const currentUser =
            await getCurrentUser();

        setUser(currentUser);
    };

    const logout = async () => {

        const refreshToken =
            localStorage.getItem("refreshToken");

        try {

            if (refreshToken) {
                await logoutApi(refreshToken);
            }

        } catch (error) {

            console.error(
                "Logout API failed",
                error
            );

        } finally {

            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");

            setUser(null);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: user !== null,
                loading,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {

    const context = useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuth must be used inside AuthProvider"
        );
    }

    return context;
};
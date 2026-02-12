"use client";

import { AuthContext } from "@/contexts/AuthContext";
import { api } from "@/services";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";
import useSWR from "swr";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const router = useRouter();

    const {
        data: user = null,
        isLoading,
        mutate,
    } = useSWR("/api/auth/me", () => api.authService.getUser(), {
        onError: () => router.push("/"),
    });

    const refreshUser = async () => {
        mutate();
    };

    const login = async () => {
        const redirect = await api.authService.getGoogleLoginURL();

        window.location.href = redirect.url;
    };

    const logout = async () => {
        try {
            await api.authService.logout();

            refreshUser();
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    useEffect(() => {
        refreshUser();
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading: isLoading, login, logout, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
};

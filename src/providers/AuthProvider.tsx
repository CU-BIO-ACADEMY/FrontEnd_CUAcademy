"use client";

import { AuthContext } from "@/contexts/AuthContext";
import { api } from "@/services";
import { User } from "@/types/user";
import { ReactNode, useEffect, useState } from "react";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const refreshUser = async () => {
        try {
            const currentUser = await api.authService.getUser();
            setUser(currentUser);
        } catch (error: any) {
            if (error?.status === 401) {
                setUser(null);
            } else {
                console.error("Error refreshing user:", error);
                setUser(null);
            }
        } finally {
            setLoading(false);
        }
    };

    const login = async () => {
        const redirect = await api.authService.getGoogleLoginURL();

        window.location.href = redirect.url;
    };

    const logout = async () => {
        try {
            await api.authService.logout();

            setUser(null);
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    useEffect(() => {
        refreshUser();
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
};

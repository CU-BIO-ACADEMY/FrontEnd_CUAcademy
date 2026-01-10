"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

export const AuthGuard = ({ children }: { children: ReactNode }) => {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.replace("/");
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="flex items-center justify-center w-full h-screen">
                <div className="text-lg">กำลังโหลด...</div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return <>{children}</>;
};

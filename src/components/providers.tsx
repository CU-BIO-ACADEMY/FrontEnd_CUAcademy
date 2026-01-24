"use client";

import { AuthProvider } from "@/providers/AuthProvider";
import { ReactNode } from "react";
import { Toaster } from "sonner";

export const LayoutProviders = ({ children }: { children: ReactNode }) => {
    return (
        <AuthProvider>
            <Toaster richColors  />
            {children}
        </AuthProvider>
    );
};

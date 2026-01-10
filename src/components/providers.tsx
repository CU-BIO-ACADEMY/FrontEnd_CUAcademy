"use client";

import { AuthProvider } from "@/providers/AuthProvider";
import { ReactNode } from "react";

export const LayoutProviders = ({ children }: { children: ReactNode }) => {
    return <AuthProvider>{children}</AuthProvider>;
};

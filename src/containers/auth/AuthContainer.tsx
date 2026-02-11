"use client";

import { useAuth } from "@/hooks/useAuth";
import { Button } from "@heroui/react";

export const AuthContainer = () => {
    const { login } = useAuth();

    return (
        <div>
            <Button onPress={login}>Login With Google</Button>
        </div>
    );
};

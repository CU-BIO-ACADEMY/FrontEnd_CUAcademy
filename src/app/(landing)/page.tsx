"use client";

import { useAuth } from "@/hooks/useAuth";
import { Button } from "@heroui/react";

export default function Landing() {
    const { login } = useAuth();

    return (
        <Button onPress={login} className=" text-white bg-blue-600 hover:bg-blue-700 ">
            <i className="fa-brands fa-google text-xl"></i>
            <span>เข้าสู่ระบบด้วย Google</span>
        </Button>
    );
}

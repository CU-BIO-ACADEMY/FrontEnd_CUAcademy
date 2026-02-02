'use client'
import React from 'react'
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@heroui/react";
import { Image } from '@heroui/react';
import { useRouter } from 'next/navigation';

function LoginContainer() {
    const { login } = useAuth();
    const router = useRouter();

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-linear-to-br from-pink-50 via-white to-pink-100">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-white rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob animation-delay-4000"></div>
            </div>

            {/* Login Card */}
            <div className="relative z-10 w-full max-w-md mx-4">
                <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 md:p-12 border border-pink-100">
                    {/* Logo or Icon */}
                    <div className="flex justify-center mb-8">
                         <Image onClick={() => router.push('/home')} src={`/logo/logo2.png`} alt={`logo`} width={`256`} height={'128'} className={`object-contain cursor-pointer`} />
                    </div>

                    {/* Title */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold bg-linear-to-br from-pink-500 to-pink-400 bg-clip-text text-transparent mb-2">
                            ยินดีต้อนรับ
                        </h1>
                        <p className="text-gray-500 text-sm">
                            เข้าสู่ระบบเพื่อเริ่มต้นใช้งาน
                        </p>
                    </div>

                    {/* Login Button */}
                    <Button
                        onPress={login}
                        className="w-full h-14 text-white bg-linear-to-br from-pink-500 to-pink-400 hover:from-pink-600 hover:to-pink-500 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl font-medium"
                        size="lg"
                    >
                        <i className="fa-brands fa-google text-xl"></i>
                        <span className="text-base">เข้าสู่ระบบด้วย Google</span>
                    </Button>

                    {/* Footer Text */}
                    <p className="text-center text-gray-400 text-xs mt-8">
                        การเข้าสู่ระบบแสดงว่าคุณยอมรับ
                        <br />
                        <span className="text-pink-400 hover:text-pink-500 cursor-pointer">เงื่อนไขการใช้งาน</span>
                        {' '}และ{' '}
                        <span className="text-pink-400 hover:text-pink-500 cursor-pointer">นโยบายความเป็นส่วนตัว</span>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default LoginContainer

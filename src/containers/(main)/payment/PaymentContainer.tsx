"use client";
import { useEffect, useState } from "react";
import { Card, CardBody, CardHeader, Input } from "@heroui/react";
import generatePayload from "promptpay-qr";
import { QRCodeSVG } from "qrcode.react";
import { PaymentUploadContainer } from "./PaymentUploadContainer";

const PROMPTPAY_NUMBER = process.env.NEXT_PUBLIC_ACCOUNT_NUMBER;

export const PaymentContainer = () => {
    const [qrCode, setQrCode] = useState<string>("");
    const [amount, setAmount] = useState<number>(100);

    useEffect(() => {
        const payload = generatePayload(PROMPTPAY_NUMBER!, { amount: amount });
        setQrCode(payload);
    }, [amount]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(e.target.value) || 0;
        setAmount(value);
    };

    return (
        <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-pink-50 via-white to-pink-100 p-2 md:p-4">
            {/* Background decorative elements */}

            {/* Payment Card */}
            <Card className="relative z-10 w-full max-w-4xl bg-white/80 backdrop-blur-lg shadow-2xl border border-pink-100 rounded-2xl md:rounded-3xl">
                {/* Header - แสดงเฉพาะมือถือ */}
                <CardHeader className="flex md:hidden flex-col gap-2 items-center pt-4 pb-2">
                    <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-pink-300 rounded-xl flex items-center justify-center shadow-lg">
                        <i className="fa-solid fa-wallet text-white text-xl"></i>
                    </div>
                    <h2 className="text-xl font-bold bg-gradient-to-r from-pink-500 to-pink-400 bg-clip-text text-transparent">
                        เติมเงิน
                    </h2>
                </CardHeader>

                <CardBody className="p-4 md:p-8">
                    {/* Layout แนวนอนสำหรับ desktop, แนวตั้งสำหรับ mobile */}
                    <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-center md:items-start">
                        {/* Left Side - QR Code Section */}
                        <div className="flex flex-col gap-3 md:gap-6 items-center md:w-1/2 w-full">
                            {/* Header - แสดงเฉพาะ desktop */}
                            <div className="hidden md:flex flex-col gap-3 items-center w-full">
                                <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-pink-300 rounded-2xl flex items-center justify-center shadow-lg">
                                    <i className="fa-solid fa-wallet text-white text-2xl"></i>
                                </div>
                                <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-pink-400 bg-clip-text text-transparent">
                                    เติมเงิน
                                </h2>
                            </div>

                            {/* QR Code */}
                            <div className="relative">
                                <div className="p-1 bg-gradient-to-br from-pink-400 to-pink-300 rounded-xl md:rounded-2xl shadow-lg">
                                    <div className="bg-white p-3 md:p-5 rounded-lg md:rounded-xl">
                                        <QRCodeSVG
                                            value={qrCode}
                                            level="M"
                                            className="w-48 h-48 md:w-60 md:h-60"
                                        />
                                    </div>
                                </div>
                                <div className="absolute -top-1 -left-1 md:-top-2 md:-left-2 w-4 h-4 md:w-6 md:h-6 border-t-2 border-l-2 md:border-t-3 md:border-l-3 border-pink-400 rounded-tl-lg"></div>
                                <div className="absolute -top-1 -right-1 md:-top-2 md:-right-2 w-4 h-4 md:w-6 md:h-6 border-t-2 border-r-2 md:border-t-3 md:border-r-3 border-pink-400 rounded-tr-lg"></div>
                                <div className="absolute -bottom-1 -left-1 md:-bottom-2 md:-left-2 w-4 h-4 md:w-6 md:h-6 border-b-2 border-l-2 md:border-b-3 md:border-l-3 border-pink-400 rounded-bl-lg"></div>
                                <div className="absolute -bottom-1 -right-1 md:-bottom-2 md:-right-2 w-4 h-4 md:w-6 md:h-6 border-b-2 border-r-2 md:border-b-3 md:border-r-3 border-pink-400 rounded-br-lg"></div>
                            </div>

                            {/* Info Section */}
                            <div className="text-center bg-pink-50/50 rounded-xl p-3 md:p-4 w-full border border-pink-100">
                                <p className="text-xs md:text-sm text-gray-500 mb-1">สแกน QR Code เพื่อโอนเงิน</p>
                                <p className="text-base md:text-lg font-semibold bg-gradient-to-r from-pink-500 to-pink-400 bg-clip-text text-transparent">
                                    {PROMPTPAY_NUMBER}
                                </p>
                            </div>
                        </div>

                        {/* Divider - แสดงเฉพาะ desktop */}
                        <div className="hidden md:block w-px bg-gradient-to-b from-transparent via-pink-200 to-transparent self-stretch"></div>

                        {/* Right Side - Input Section */}
                        <div className="flex flex-col gap-4 md:gap-6 w-full md:w-1/2">
                            <div className="space-y-3 md:space-y-4">
                                <Input
                                    type="number"
                                    label="จำนวนเงิน"
                                    placeholder="0.00"
                                    value={amount.toString()}
                                    onChange={handleChange}
                                    classNames={{
                                        input: "text-base md:text-lg font-semibold",
                                        inputWrapper: "bg-white border-2 border-pink-200 hover:border-pink-300 focus-within:border-pink-400 rounded-xl h-12 md:h-14 shadow-sm",
                                        label: "text-pink-400 font-medium text-sm md:text-base"
                                    }}
                                    startContent={
                                        <div className="pointer-events-none flex items-center">
                                            <span className="text-pink-400 font-bold text-base md:text-lg">฿</span>
                                        </div>
                                    }
                                />

                                <PaymentUploadContainer />
                            </div>

                            {/* Helper Text */}
                            <div className="flex items-start gap-2 bg-pink-50/50 rounded-xl p-2.5 md:p-3 w-full border border-pink-100">
                                <i className="fa-solid fa-circle-info text-pink-400 mt-0.5 text-sm"></i>
                                <p className="text-xs text-gray-600">
                                    โปรดอัพโหลดหลักฐานการโอนเงินหลังจากชำระเงินเสร็จสิ้น
                                </p>
                            </div>
                        </div>
                    </div>
                </CardBody>
            </Card>
        </div>
    );
};

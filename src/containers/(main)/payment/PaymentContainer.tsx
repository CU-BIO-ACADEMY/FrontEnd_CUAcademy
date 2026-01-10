"use client";
import { useEffect, useState } from "react";
import { Card, CardBody, CardHeader, Input } from "@heroui/react";
import generatePayload from "promptpay-qr";
import { QRCodeSVG } from "qrcode.react";

import { PaymentUploadContainer } from "./PaymentUploadContainer";

const PROMPTPAY_NUMBER = process.env.NEXT_PUBLIC_ACCOUNT_NUMBER;

export const PaymentContainer = () => {
    const [qrCode, setQrCode] = useState<string>("");
    const [amount, setAmount] = useState<string>("100");

    useEffect(() => {
        const payload = generatePayload(PROMPTPAY_NUMBER!, { amount: parseInt(amount) });

        setQrCode(payload);
    }, [amount]);

    return (
        <div className="flex flex-col gap-4 items-center justify-center min-h-screen p-4">
            <Card className="w-full max-w-md ring ring-(--pink1)">
                <CardHeader className="flex justify-center items-center gap-2 *:text-(--pink2)">
                    <i className="fa-solid fa-wallet"></i>
                    <span className="text-xl">เติมเงิน</span>
                </CardHeader>
                <CardBody className="flex flex-col gap-4 items-center">
                    <div className="bg-white p-4 rounded-lg">
                        <QRCodeSVG value={qrCode} size={256} level="M" />
                    </div>

                    <div className="text-center">
                        <p className="text-sm text-gray-400">สแกน QR Code เพื่อโอนเงิน</p>
                        <p className="text-lg font-semibold">{PROMPTPAY_NUMBER}</p>
                    </div>

                    <div className="w-full space-y-4">
                        <Input
                            type="number"
                            label="จำนวนเงิน"
                            placeholder="0.00"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            startContent={
                                <div className="pointer-events-none flex items-center">
                                    <span className="text-default-400 text-small">฿</span>
                                </div>
                            }
                        />

                        <PaymentUploadContainer />
                    </div>
                </CardBody>
            </Card>
        </div>
    );
};

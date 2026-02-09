"use client";

import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    Button,
} from "@heroui/react";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "sonner";
import { useRef } from "react";

interface ShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    activityTitle: string;
    activityId: string;
}

export function ShareModal({
    isOpen,
    onClose,
    activityTitle,
    activityId,
}: ShareModalProps) {
    const qrRef = useRef<HTMLDivElement>(null);

    const getShareUrl = () => {
        return `${window.location.origin}/activity/${activityId}`;
    };

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(getShareUrl());
            toast.success("คัดลอกลิงก์แล้ว");
        } catch {
            toast.error("ไม่สามารถคัดลอกลิงก์ได้");
        }
    };

    const handleDownloadQR = () => {
        const svgElement = qrRef.current?.querySelector("svg");
        if (!svgElement) return;

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const svgData = new XMLSerializer().serializeToString(svgElement);
        const img = new Image();
        const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
        const url = URL.createObjectURL(svgBlob);

        img.onload = () => {
            const size = 512;
            const padding = 40;
            canvas.width = size + padding * 2;
            canvas.height = size + padding * 2;

            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, padding, padding, size, size);

            URL.revokeObjectURL(url);

            const link = document.createElement("a");
            link.download = `qr-${activityId}.png`;
            link.href = canvas.toDataURL("image/png");
            link.click();

            toast.success("ดาวน์โหลด QR Code แล้ว");
        };

        img.src = url;
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="sm"
            placement="center"
        >
            <ModalContent>
                <ModalHeader className="flex items-center gap-3 bg-gradient-to-r from-blue-50 to-pink-50 rounded-xl">
                    <i className="fa-solid fa-share text-pink-500" />
                    <div>
                        <h2 className="text-xl font-bold">แชร์กิจกรรม</h2>
                        <p className="text-sm text-gray-500 font-normal line-clamp-1">
                            {activityTitle}
                        </p>
                    </div>
                </ModalHeader>

                <ModalBody className="py-6 flex flex-col items-center gap-5">
                    <div
                        ref={qrRef}
                        className="p-1 bg-gradient-to-br from-[var(--pink1)] to-[var(--pink2)] rounded-xl shadow-lg"
                    >
                        <div className="bg-white p-4 rounded-lg">
                            <QRCodeSVG
                                value={typeof window !== "undefined" ? getShareUrl() : ""}
                                level="M"
                                className="w-48 h-48"
                            />
                        </div>
                    </div>

                    <div className="w-full flex flex-col gap-2">
                        <Button
                            fullWidth
                            variant="shadow"
                            className="bg-gradient-to-r from-[var(--pink2)] to-pink-400 text-white font-medium shadow-pink-200/50"
                            startContent={<i className="fa-solid fa-copy" />}
                            onPress={handleCopyLink}
                        >
                            คัดลอกลิงก์
                        </Button>
                        <Button
                            fullWidth
                            variant="bordered"
                            className="border-[var(--pink2)] text-[var(--pink2)] font-medium"
                            startContent={<i className="fa-solid fa-download" />}
                            onPress={handleDownloadQR}
                        >
                            ดาวน์โหลด QR Code
                        </Button>
                    </div>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}

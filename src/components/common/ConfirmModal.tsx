"use client";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
} from "@heroui/react";
import { AlertTriangle } from "lucide-react";

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    message?: string;
    confirmText?: string;
    cancelText?: string;
    confirmColor?: "primary" | "danger" | "warning" | "success";
    isLoading?: boolean;
}

export function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title = "ยืนยันการดำเนินการ",
    message = "คุณต้องการดำเนินการนี้หรือไม่?",
    confirmText = "ยืนยัน",
    cancelText = "ยกเลิก",
    confirmColor = "danger",
    isLoading = false,
}: ConfirmModalProps) {
    const handleConfirm = () => {
        onConfirm();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} placement="center" size="sm">
            <ModalContent>
                <ModalHeader className="flex items-center gap-3 text-gray-900">
                    <div className="p-2 bg-red-100 rounded-full">
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                    </div>
                    <span className="text-lg font-semibold">{title}</span>
                </ModalHeader>
                <ModalBody>
                    <p className="text-gray-600">{message}</p>
                </ModalBody>
                <ModalFooter>
                    <Button color="default" variant="flat" onPress={onClose} isDisabled={isLoading}>
                        {cancelText}
                    </Button>
                    <Button color={confirmColor} onPress={handleConfirm} isLoading={isLoading}>
                        {confirmText}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}

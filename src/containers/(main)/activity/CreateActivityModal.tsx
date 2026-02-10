"use client";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
} from "@heroui/react";
import { useState } from "react";
import { api } from "@/services";
import { toast } from "sonner";
import FormBody, { ActivityFormSubmitData } from "@/components/(main)/activity/modal/FormBody";

interface CreateActivityModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export const CreateActivityModal = ({ isOpen, onClose, onSuccess }: CreateActivityModalProps) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (formData: ActivityFormSubmitData) => {
        setIsLoading(true);
        try {
            await api.activityService.createActivity({
                title: formData.title,
                description: formData.description,
                description_short: formData.description_short,
                registration_open_at: formData.registration_open_at,
                registration_close_at: formData.registration_close_at,
                schedules: formData.schedules,
                thumbnail: formData.thumbnail,
                attachments: formData.attachments,
            });
            
            toast.success("สร้างกิจกรรมสำเร็จ");
            handleClose();
            onSuccess?.();
        } catch (error: unknown) {
            toast.error(error instanceof Error ? error.message : "เกิดข้อผิดพลาดในการสร้างกิจกรรม");
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            size="2xl"
            scrollBehavior="inside"
            placement="center"
            classNames={{
                base: "bg-white",
                header: "border-b border-gray-200",
                footer: "border-t border-gray-200",
            }}
        >
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">
                    <h3 className="text-2xl font-semibold text-(--pink2)">เพิ่มกิจกรรมใหม่</h3>
                </ModalHeader>
                <ModalBody className="py-6">
                    <FormBody
                        onSubmit={handleSubmit}
                        isLoading={isLoading}
                    />
                </ModalBody>
                <ModalFooter>
                    <Button variant="light" onPress={handleClose} isDisabled={isLoading}>
                        ยกเลิก
                    </Button>
                    <Button
                        className="bg-(--pink2) text-white"
                        type="submit"
                        form="create-activity-form"
                        isLoading={isLoading}
                    >
                        สร้างกิจกรรม
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

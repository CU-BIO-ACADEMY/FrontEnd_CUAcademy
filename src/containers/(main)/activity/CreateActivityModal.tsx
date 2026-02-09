"use client";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Form
} from "@heroui/react";
import { useState } from "react";
import { api } from "@/services";
import { toast } from "sonner";
import type { DateValue } from "@internationalized/date";
import FormBody, { AttachmentFile } from "@/components/(main)/activity/modal/FormBody";

interface CreateActivityModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export const CreateActivityModal = ({ isOpen, onClose, onSuccess }: CreateActivityModalProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [registrationOpenAt, setRegistrationOpenAt] = useState<DateValue | null>(null);
    const [registrationCloseAt, setRegistrationCloseAt] = useState<DateValue | null>(null);
    const [eventStartAt, setEventStartAt] = useState<DateValue | null>(null);
    const [thumbnail, setThumbnail] = useState<File | null>(null);
    const [thumbnailPreview, setThumbnailPreview] = useState<string>("");
    const [attachments, setAttachments] = useState<AttachmentFile[]>([]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setThumbnail(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setThumbnailPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAttachmentsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const newFiles = Array.from(files).map((file) => ({
                file,
                name: file.name,
            }));
            setAttachments((prev) => {
                const combined = [...prev, ...newFiles];
                return combined.slice(0, 10);
            });
        }
    };

    const removeAttachment = (index: number) => {
        setAttachments((prev) => prev.filter((_, i) => i !== index));
    };
    const toDate = (dateValue: DateValue): Date => {
        if ('hour' in dateValue && 'minute' in dateValue) {
            return new Date(dateValue.year, dateValue.month - 1, dateValue.day, dateValue.hour, dateValue.minute);
        } else {
            return new Date(dateValue.year, dateValue.month - 1, dateValue.day, 0, 0);
        }
    };

    const onSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        try{
            const data = Object.fromEntries(new FormData(e.currentTarget));
            if (!thumbnail) {
                toast.error("โปรดเลือกรูปภาพหลัก");
                return;
            }

            if (!data.max_users || !data.price) {
                toast.error("โปรดกรอกข้อมูลให้ครบถ้วน");
                return;
            }

            if (!registrationOpenAt || !registrationCloseAt || !eventStartAt) {
                toast.error("โปรดกรอกวันที่ให้ครบถ้วน");
                return;
            }

            const finalData = {
                title: data.title as string,
                description: data.description as string,
                description_short: data.description_short as string,
                max_users: parseInt(data.max_users as string),
                price: parseFloat(data.price as string),
                thumbnail: thumbnail,
                registration_open_at: toDate(registrationOpenAt).toISOString(),
                registration_close_at: toDate(registrationCloseAt).toISOString(),
                event_start_at: toDate(eventStartAt).toISOString(),
                attachments: attachments.map((a) => a.file),
            }
            console.log(finalData)
            await api.activityService.createActivity(finalData);
            toast.success("สร้างกิจกรรมสำเร็จ");

            handleClose();
            onSuccess?.();
        } catch (error: unknown) {
            toast.error(error instanceof Error ? error.message : "เกิดข้อผิดพลาดในการสร้างกิจกรรม")
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setRegistrationOpenAt(null);
        setRegistrationCloseAt(null);
        setEventStartAt(null);
        setThumbnail(null);
        setThumbnailPreview("");
        setAttachments([]);
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
            <Form onSubmit={onSubmit} className="max-w-none w-full">
                <ModalContent>
                    <ModalHeader className="flex flex-col gap-1">
                        <h3 className="text-2xl font-semibold text-(--pink2)">เพิ่มกิจกรรมใหม่</h3>
                    </ModalHeader>
                        <ModalBody className="py-6">
                            <FormBody
                                thumbnailPreview={thumbnailPreview}
                                handleFileChange={handleFileChange}
                                registrationOpenAt={registrationOpenAt}
                                setRegistrationOpenAt={setRegistrationOpenAt}
                                registrationCloseAt={registrationCloseAt}
                                setRegistrationCloseAt={setRegistrationCloseAt}
                                eventStartAt={eventStartAt}
                                setEventStartAt={setEventStartAt}
                                attachments={attachments}
                                handleAttachmentsChange={handleAttachmentsChange}
                                removeAttachment={removeAttachment}
                            />
                        </ModalBody>
                        <ModalFooter>
                            <Button variant="light" onPress={handleClose} disabled={isLoading}>
                                ยกเลิก
                            </Button>
                            <Button
                                className="bg-(--pink2) text-white"
                                type="submit"
                                isLoading={isLoading}
                            >
                                สร้างกิจกรรม
                            </Button>
                        </ModalFooter>
                </ModalContent>
            </Form>
        </Modal>
    );
};

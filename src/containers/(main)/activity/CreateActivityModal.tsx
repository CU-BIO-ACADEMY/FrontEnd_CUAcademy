"use client";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Input,
    Textarea,
    DatePicker,
} from "@heroui/react";
import { useState } from "react";
import { api } from "@/services";
import { toast } from "sonner";
import type { DateValue } from "@internationalized/date";

interface CreateActivityModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export const CreateActivityModal = ({ isOpen, onClose, onSuccess }: CreateActivityModalProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        description_short: "",
        max_users: "",
        price: "",
    });
    const [registrationOpenAt, setRegistrationOpenAt] = useState<DateValue | null>(null);
    const [registrationCloseAt, setRegistrationCloseAt] = useState<DateValue | null>(null);
    const [eventStartAt, setEventStartAt] = useState<DateValue | null>(null);
    const [thumbnail, setThumbnail] = useState<File | null>(null);
    const [thumbnailPreview, setThumbnailPreview] = useState<string>("");

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

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

    const handleSubmit = async () => {
        try {
            setIsLoading(true);

            if (!thumbnail) {
                toast.error("โปรดเลือกรูปภาพหลัก");
                return;
            }

            if (!formData.max_users || !formData.price) {
                toast.error("โปรดกรอกข้อมูลให้ครบถ้วน");
                return;
            }

            if (!registrationOpenAt || !registrationCloseAt || !eventStartAt) {
                toast.error("โปรดกรอกวันที่ให้ครบถ้วน");
                return;
            }

            const toDate = (dateValue: DateValue): Date => {
                if ('hour' in dateValue && 'minute' in dateValue) {
                    return new Date(dateValue.year, dateValue.month - 1, dateValue.day, dateValue.hour, dateValue.minute);
                } else {
                    return new Date(dateValue.year, dateValue.month - 1, dateValue.day, 0, 0);
                }
            };

            const activityData = {
                title: formData.title,
                description: formData.description,
                description_short: formData.description_short,
                max_users: parseInt(formData.max_users),
                price: parseFloat(formData.price),
                registration_open_at: toDate(registrationOpenAt),
                registration_close_at: toDate(registrationCloseAt),
                event_start_at: toDate(eventStartAt),
                thumbnail: thumbnail,
            };

            await api.activityService.createActivity(activityData);

            toast.success("สร้างกิจกรรมสำเร็จ");
            handleClose();
            onSuccess?.();
        } catch (error: any) {
            toast.error(error.message || "เกิดข้อผิดพลาดในการสร้างกิจกรรม");
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setFormData({
            title: "",
            description: "",
            description_short: "",
            max_users: "",
            price: "",
        });
        setRegistrationOpenAt(null);
        setRegistrationCloseAt(null);
        setEventStartAt(null);
        setThumbnail(null);
        setThumbnailPreview("");
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            size="2xl"
            scrollBehavior="inside"
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
                    <div className="flex flex-col gap-4">
                        {/* รูปภาพหลัก */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium">รูปภาพหลัก *</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-(--pink2) file:text-white hover:file:bg-(--pink1) file:cursor-pointer"
                            />
                            {thumbnailPreview && (
                                <img
                                    src={thumbnailPreview}
                                    alt="Preview"
                                    className="mt-2 w-full h-48 object-cover rounded-lg"
                                />
                            )}
                        </div>

                        {/* ชื่อกิจกรรม */}
                        <Input
                            label="ชื่อกิจกรรม"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            placeholder="กรอกชื่อกิจกรรม"
                            isRequired
                            classNames={{
                                label: "text-gray-700",
                                input: "text-gray-900",
                            }}
                        />

                        {/* คำอธิบายสั้น */}
                        <Textarea
                            label="คำอธิบายสั้น"
                            name="description_short"
                            value={formData.description_short}
                            onChange={handleInputChange}
                            placeholder="กรอกคำอธิบายสั้นๆ"
                            isRequired
                            minRows={2}
                            classNames={{
                                label: "text-gray-700",
                                input: "text-gray-900",
                            }}
                        />

                        {/* รายละเอียด */}
                        <Textarea
                            label="รายละเอียดกิจกรรม"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="กรอกรายละเอียดกิจกรรม"
                            isRequired
                            minRows={4}
                            classNames={{
                                label: "text-gray-700",
                                input: "text-gray-900",
                            }}
                        />

                        {/* จำนวนผู้เข้าร่วมและราคา */}
                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="จำนวนผู้เข้าร่วมสูงสุด"
                                name="max_users"
                                type="number"
                                value={formData.max_users}
                                onChange={handleInputChange}
                                placeholder="0"
                                isRequired
                                min={1}
                                classNames={{
                                    label: "text-gray-700",
                                    input: "text-gray-900",
                                }}
                            />
                            <Input
                                label="ค่าสมัคร (บาท)"
                                name="price"
                                type="number"
                                value={formData.price}
                                onChange={handleInputChange}
                                placeholder="0"
                                isRequired
                                min={0}
                                classNames={{
                                    label: "text-gray-700",
                                    input: "text-gray-900",
                                }}
                            />
                        </div>

                        {/* วันที่เปิด-ปิดรับสมัคร */}
                        <div className="grid grid-cols-2 gap-4">
                            <DatePicker
                                label="วันที่เปิดรับสมัคร"
                                value={registrationOpenAt}
                                onChange={setRegistrationOpenAt}
                                isRequired
                                granularity="minute"
                                hourCycle={24}
                                hideTimeZone
                                classNames={{
                                    label: "text-gray-700",
                                    input: "text-gray-900",
                                }}
                            />
                            <DatePicker
                                label="วันที่ปิดรับสมัคร"
                                value={registrationCloseAt}
                                onChange={setRegistrationCloseAt}
                                isRequired
                                granularity="minute"
                                hourCycle={24}
                                hideTimeZone
                                classNames={{
                                    label: "text-gray-700",
                                    input: "text-gray-900",
                                }}
                            />
                        </div>

                        {/* วันที่จัดกิจกรรม */}
                        <DatePicker
                            label="วันที่จัดกิจกรรม"
                            value={eventStartAt}
                            onChange={setEventStartAt}
                            isRequired
                            granularity="minute"
                            hourCycle={24}
                            hideTimeZone
                            classNames={{
                                label: "text-gray-700",
                                input: "text-gray-900",
                            }}
                        />
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button variant="light" onPress={handleClose} disabled={isLoading}>
                        ยกเลิก
                    </Button>
                    <Button
                        className="bg-(--pink2) text-white"
                        onPress={handleSubmit}
                        isLoading={isLoading}
                    >
                        สร้างกิจกรรม
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

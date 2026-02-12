"use client";

import { UseDisclosureProps, Form } from "@heroui/react";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    Textarea,
    Input,
    Button,
} from "@heroui/react";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState, useRef } from "react";
import { api } from "@/services";
import { toast } from "sonner";

const DEFAULT_SUBJECT = `เรื่อง แจ้งผลการสมัครอบรมโครงการ CU Bio Academy 2026`;

const DEFAULT_BODY = `เรียน {prefix} {name} \n{rank} {school} \n\nภาควิชาชีววิทยาฯ ได้รับการโอนเงินเข้าร่วมโครงการอบรมเชิงปฏิบัติการใน\nโครงการ CU Bio Academy 2026 ในวัน {date} เป็นเงิน {money} บาท และท่านได้ลงทะเบียนเป็นลำดับที่ {id} \n\nสถานที่จัดอบรม คือ อาคารมหามกุฎ ชั้น 4 ห้อง 409 คณะวิทยาศาสตร์ จุฬาลงกรณ์\nมหาวิทยาลัย \n\nวันอบรม - วันที่ {date} เริ่มเวลา {startTime}-{endTime} น. นอกจากนี้ ขอส่งรายละเอียดโครงการ และกำหนดการดังไฟล์เเนบ ครับ \n\nขอบคุณผู้ปกครองและนักเรียนที่ให้ความสนใจในกิจกรรมของภาควิชาชีววิทยาใน\nโอกาสนี้ \n\nรองศาสตราจารย์ ดร.สิทธิพร ภัทรดิลกรัตน์ \nรองหัวหน้าภาควิชา \nภาควิชาชีววิทยา คณะวิทยาศาสตร์ จุฬาลงกรณ์มหาวิทยาลัย \nอาคารชีววิทยา 1/เคมี 2 คณะวิทยาศาสตร์ \nจุฬาลงกรณ์มหาวิทยาลัย \nเเขวงวังใหม่ เขตปทุมวัน กรุงเทพฯ 10330 \nโทร 063-978-2954\nEmail: {email}`;

const formatEmailSchema = z.object({
    subject: z.string().min(1, "กรุณากรอกหัวข้อ Email"),
    body: z.string().min(1, "กรุณากรอกเนื้อหา Email"),
});

type FormatEmailFormData = z.infer<typeof formatEmailSchema>;

interface FormatEmailModalProps extends UseDisclosureProps {
    activityId: string;
    onSaved?: (subject: string, body: string) => void;
}

export function FormatEmailModal(props: FormatEmailModalProps) {
    const [isSaving, setIsSaving] = useState(false);
    const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<FormatEmailFormData>({
        resolver: zodResolver(formatEmailSchema),
        defaultValues: {
            subject: DEFAULT_SUBJECT,
            body: DEFAULT_BODY,
        },
    });

    useEffect(() => {
        if (props.isOpen) {
            api.activityService
                .getEmailTemplate(props.activityId)
                .then((template) => {
                    reset({
                        subject: template.subject,
                        body: template.body,
                    });
                })
                .catch(() => {
                    reset({
                        subject: DEFAULT_SUBJECT,
                        body: DEFAULT_BODY,
                    });
                });
        }
    }, [props.isOpen, props.activityId, reset]);

    const onSubmit = async (data: FormatEmailFormData) => {
        setIsSaving(true);
        try {
            await api.activityService.saveEmailTemplate(props.activityId, {
                subject: data.subject,
                body: data.body,
            });
            toast.success("บันทึกรูปแบบ Email สำเร็จ");
            props.onSaved?.(data.subject, data.body);
            props.onClose?.();
        } catch {
            toast.error("เกิดข้อผิดพลาดในการบันทึก");
        } finally {
            setIsSaving(false);
        }
    };

    const handleClose = () => {
        reset();
        setAttachedFiles([]);
        props.onClose?.();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            setAttachedFiles((prev) => [...prev, ...Array.from(files)]);
        }
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            setAttachedFiles((prev) => [...prev, ...Array.from(files)]);
        }
    };

    const removeFile = (index: number) => {
        setAttachedFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    return (
        <Modal
            onClose={handleClose}
            isOpen={props.isOpen}
            onOpenChange={props.onChange}
            scrollBehavior="inside"
            placement="center"
        >
            <Form
                className="w-full flex flex-col overflow-hidden"
                onSubmit={handleSubmit(onSubmit)}
            >
                <ModalContent className="max-w-xl">
                    <ModalHeader className="flex items-center gap-2">
                        <div className="w-10 h-10 flex items-center justify-center bg-pink-300/30 rounded-sm">
                            <i className="fa-solid fa-envelope text-pink-500 text-sm"></i>
                        </div>
                        สร้างรูปแบบ Email
                    </ModalHeader>
                    <ModalBody>
                        <Controller
                            name="subject"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    variant="faded"
                                    label="หัวข้อ Email"
                                    labelPlacement="outside"
                                    placeholder="ใส่หัวข้อ"
                                    isInvalid={!!errors.subject}
                                    errorMessage={errors.subject?.message}
                                />
                            )}
                        />
                        <Controller
                            name="body"
                            control={control}
                            render={({ field }) => (
                                <Textarea
                                    {...field}
                                    isClearable
                                    variant="faded"
                                    classNames={{
                                        input: "resize-y min-h-[60px]",
                                    }}
                                    placeholder="กรอกรูปแบบ"
                                    isInvalid={!!errors.body}
                                    errorMessage={errors.body?.message}
                                    onClear={() => field.onChange("")}
                                />
                            )}
                        />

                        {/* File attachment */}
                        <div className="flex flex-col gap-1.5">
                            <span className="text-sm text-foreground">ไฟล์แนบ (ไม่บังคับ)</span>
                            <input
                                ref={fileInputRef}
                                type="file"
                                multiple
                                className="hidden"
                                onChange={handleFileChange}
                            />
                            <div
                                className={`flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-4 py-5 cursor-pointer transition-colors ${
                                    isDragging
                                        ? "border-primary bg-primary/5"
                                        : "border-default-300 hover:border-primary hover:bg-default-50"
                                }`}
                                onClick={() => fileInputRef.current?.click()}
                                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                                onDragLeave={() => setIsDragging(false)}
                                onDrop={handleDrop}
                            >
                                <i className="fa-solid fa-cloud-arrow-up text-2xl text-default-400" />
                                <span className="text-sm text-default-500">ลากไฟล์มาวางที่นี่ หรือคลิกเพื่อเลือกไฟล์</span>
                            </div>
                            {attachedFiles.length > 0 && (
                                <div className="flex flex-col gap-2 mt-1">
                                    {attachedFiles.map((file, index) => (
                                        <div
                                            key={`${file.name}-${index}`}
                                            className="flex items-center gap-3 rounded-lg border border-default-200 bg-default-50 px-4 py-2.5"
                                        >
                                            <i className="fa-solid fa-file text-primary text-base" />
                                            <div className="flex flex-col flex-1 min-w-0">
                                                <span className="text-sm font-medium truncate">{file.name}</span>
                                                <span className="text-xs text-default-400">{formatFileSize(file.size)}</span>
                                            </div>
                                            <Button
                                                isIconOnly
                                                size="sm"
                                                variant="light"
                                                color="danger"
                                                onPress={() => removeFile(index)}
                                            >
                                                <i className="fa-solid fa-xmark" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            variant="flat"
                            color="default"
                            onPress={handleClose}
                            type="button"
                        >
                            ยกเลิก
                        </Button>
                        <Button
                            type="submit"
                            variant="shadow"
                            color="success"
                            className="text-white"
                            isLoading={isSaving}
                        >
                            สร้างแม่แบบ
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Form>
        </Modal>
    );
}

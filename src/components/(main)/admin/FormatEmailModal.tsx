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
import { useEffect } from "react";

const DEFAULT_SUBJECT = `เรื่อง แจ้งผลการสมัครอบรมโครงการ CU Bio Academy 2026`;

const DEFAULT_BODY = `เรียน {prefix} {name} \n{rank} {school} \n\nภาควิชาชีววิทยาฯ ได้รับการโอนเงินเข้าร่วมโครงการอบรมเชิงปฏิบัติการใน\nโครงการ CU Bio Academy 2026 ในวัน {date} เป็นเงิน {money} บาท และท่านได้ลงทะเบียนเป็นลำดับที่ {id} \n\nสถานที่จัดอบรม คือ อาคารมหามกุฎ ชั้น 4 ห้อง 409 คณะวิทยาศาสตร์ จุฬาลงกรณ์\nมหาวิทยาลัย \n\nวันอบรม - วันที่ {date} เริ่มเวลา {startTime}-{endTime} น. นอกจากนี้ ขอส่งรายละเอียดโครงการ และกำหนดการดังไฟล์เเนบ ครับ \n\nขอบคุณผู้ปกครองและนักเรียนที่ให้ความสนใจในกิจกรรมของภาควิชาชีววิทยาใน\nโอกาสนี้ \n\nรองศาสตราจารย์ ดร.สิทธิพร ภัทรดิลกรัตน์ \nรองหัวหน้าภาควิชา \nภาควิชาชีววิทยา คณะวิทยาศาสตร์ จุฬาลงกรณ์มหาวิทยาลัย \nอาคารชีววิทยา 1/เคมี 2 คณะวิทยาศาสตร์ \nจุฬาลงกรณ์มหาวิทยาลัย \nเเขวงวังใหม่ เขตปทุมวัน กรุงเทพฯ 10330 \nโทร 063-978-2954\nEmail: {email}`;

const formatEmailSchema = z.object({
    subject: z.string().min(1, "กรุณากรอกหัวข้อ Email"),
    body: z.string().min(1, "กรุณากรอกเนื้อหา Email"),
});

type FormatEmailFormData = z.infer<typeof formatEmailSchema>;

interface FormatEmailModalProps extends UseDisclosureProps {
    id: string;
}

export function FormatEmailModal(props: FormatEmailModalProps) {
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
            reset({
                subject: DEFAULT_SUBJECT,
                body: DEFAULT_BODY,
            });
        }
    }, [props.isOpen, reset]);

    /**
     * Format placeholders:
     *   {prefix} = คำนำหน้า (เด็กชาย, เด็กหญิง, นาย, นางสาว)
     *   {name}   = ชื่อ-นามสกุลผู้สมัคร
     *   {rank}   = ลำดับที่
     *   {school} = ชื่อโรงเรียน
     *   {date}   = วันที่จัดกิจกรรม
     *   {money}  = จำนวนเงิน
     *   {id}     = ลำดับที่ลงทะเบียน
     *   {startTime}   = เวลาเริ่ม
     *   {endTime}   = เวลาจบ
     *   {email}  = อีเมลผู้ส่ง
     */
    const onSubmit = (data: FormatEmailFormData) => {
        console.log("=== สร้างแม่แบบ Email ===");
        console.log("หัวข้อ:", data.subject);
        console.log("---");
        console.log("เนื้อหา:", data.body);
        console.log("=== สิ้นสุด ===");
        props.onClose?.();
    };

    const handleClose = () => {
        reset();
        props.onClose?.();
    };

    return (
        <Modal
            onClose={handleClose}
            isOpen={props.isOpen}
            onOpenChange={props.onChange}
            scrollBehavior="inside"
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
                        >
                            สร้างแม่แบบ
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Form>
        </Modal>
    );
}

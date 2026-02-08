"use client";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Card,
    CardBody,
    RadioGroup,
    Radio,
} from "@heroui/react";
import { GraduationCap, AlertCircle, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";
import { api } from "@/services";
import { toast } from "sonner";
import type { StudentInformation } from "@/services/api/StudentInformationService";

interface ActivityRegistrationModalProps {
    isOpen: boolean;
    onClose: () => void;
    activityId: string;
    activityTitle: string;
    activityPrice: number;
    onSuccess?: () => void;
}

export function ActivityRegistrationModal({
    isOpen,
    onClose,
    activityId,
    activityTitle,
    activityPrice,
    onSuccess,
}: ActivityRegistrationModalProps) {
    const [studentProfiles, setStudentProfiles] = useState<StudentInformation[]>([]);
    const [selectedStudentId, setSelectedStudentId] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [hasProfile, setHasProfile] = useState<boolean | null>(null);

    useEffect(() => {
        if (isOpen) {
            fetchStudentProfiles();
        }
    }, [isOpen]);

    const fetchStudentProfiles = async () => {
        setIsFetching(true);
        try {
            const exists = await api.studentInformationService.checkExists();
            if (exists.exists) {
                const data = await api.studentInformationService.getStudentInformation();
                setStudentProfiles([data]);
                setHasProfile(true);
            } else {
                setHasProfile(false);
            }
        } catch {
            toast.error("ไม่สามารถดึงข้อมูลนักเรียนได้");
            setHasProfile(false);
        } finally {
            setIsFetching(false);
        }
    };

    const handleSubmit = async () => {
        if (!selectedStudentId) {
            toast.error("กรุณาเลือกผู้สมัคร");
            return;
        }

        setIsLoading(true);
        try {
            await api.activityService.joinActivity(activityId, {
                student_information_id: selectedStudentId,
            });
            toast.success("สมัครกิจกรรมสำเร็จ");
            onSuccess?.();
            onClose();
        } catch (error: unknown) {
            const err = error as { message?: string };
            toast.error(err.message || "เกิดข้อผิดพลาดในการสมัคร");
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setSelectedStudentId("");
        onClose();
    };

    const getEducationLevelText = (level: number) => {
        const map: Record<number, string> = {
            2: "ม. 2",
            3: "ม. 3",
            4: "ม. 4",
            5: "ม. 5",
            6: "ม. 6",
        };
        return map[level] || `ม. ${level}`;
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            size="2xl"
            scrollBehavior="inside"
            placement="center"
        >
            <ModalContent>
                <ModalHeader className="flex items-center gap-3 bg-gradient-to-r from-blue-50 to-pink-50">
                    <GraduationCap className="w-6 h-6 text-pink-500" />
                    <div>
                        <h2 className="text-xl font-bold">สมัครกิจกรรม</h2>
                        <p className="text-sm text-gray-500 font-normal">{activityTitle}</p>
                    </div>
                </ModalHeader>

                <ModalBody className="py-6">
                    {isFetching ? (
                        <div className="flex justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500" />
                        </div>
                    ) : hasProfile === false ? (
                        <div className="text-center py-8">
                            <AlertCircle className="w-16 h-16 text-orange-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                ยังไม่มีข้อมูลผู้สมัคร
                            </h3>
                            <p className="text-gray-500 mb-4">
                                คุณต้องเพิ่มข้อมูลผู้สมัครก่อนจึงจะสามารถสมัครกิจกรรมได้
                            </p>
                            <Button
                                color="primary"
                                className="bg-pink-400"
                                onPress={() => {
                                    onClose();
                                    window.location.href = "/profile";
                                }}
                            >
                                ไปที่หน้าโปรไฟล์
                            </Button>
                        </div>
                    ) : (
                        <>
                            <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">ค่าสมัคร</span>
                                    <span className="text-xl font-bold text-pink-500">
                                        {activityPrice.toLocaleString()} ฿
                                    </span>
                                </div>
                            </div>

                            <RadioGroup
                                label="เลือกผู้สมัคร"
                                value={selectedStudentId}
                                onValueChange={setSelectedStudentId}
                                className="gap-3"
                            >
                                {studentProfiles.map((profile) => (
                                    <Card
                                        key={profile.id}
                                        className={`border-2 transition-all ${
                                            selectedStudentId === profile.id
                                                ? "border-pink-400 bg-pink-50"
                                                : "border-transparent hover:border-gray-200"
                                        }`}
                                    >
                                        <CardBody className="p-4">
                                            <Radio value={profile.id} className="hidden">
                                                <div className="hidden">{profile.full_name}</div>
                                            </Radio>
                                            <div
                                                className="cursor-pointer"
                                                onClick={() => setSelectedStudentId(profile.id)}
                                            >
                                                <div className="flex items-start gap-3">
                                                    {selectedStudentId === profile.id && (
                                                        <CheckCircle2 className="w-5 h-5 text-pink-500 mt-0.5" />
                                                    )}
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-semibold text-lg">
                                                                {profile.prefix} {profile.full_name}
                                                            </span>
                                                            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                                                                {getEducationLevelText(profile.education_level)}
                                                            </span>
                                                        </div>
                                                        <p className="text-gray-600 text-sm mt-1">
                                                            {profile.school}
                                                        </p>
                                                        <div className="mt-2 text-sm text-gray-500">
                                                            <p>ผู้ปกครอง: {profile.parent_name}</p>
                                                            <p>อีเมล: {profile.parent_email}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardBody>
                                    </Card>
                                ))}
                            </RadioGroup>
                        </>
                    )}
                </ModalBody>

                {hasProfile !== false && (
                    <ModalFooter>
                        <Button
                            color="default"
                            variant="flat"
                            onPress={handleClose}
                            isDisabled={isLoading}
                        >
                            ยกเลิก
                        </Button>
                        <Button
                            color="primary"
                            className="bg-pink-400"
                            onPress={handleSubmit}
                            isLoading={isLoading}
                            isDisabled={!selectedStudentId || isLoading}
                        >
                            ยืนยันการสมัคร
                        </Button>
                    </ModalFooter>
                )}
            </ModalContent>
        </Modal>
    );
}

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
    Input,
    Checkbox,
} from "@heroui/react";
import {
    GraduationCap,
    AlertCircle,
    CheckCircle2,
    School,
    UtensilsCrossed,
    User,
    Mail,
} from "lucide-react";
import { useState, useEffect } from "react";
import { api } from "@/services";
import { toast } from "sonner";
import type { StudentInformation } from "@/services/api/StudentInformationService";
import { Controller, useForm } from "react-hook-form";
import { ApplicantFormData, applicantSchema } from "../profile/AddApplicantModal";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hooks/useAuth";

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
    const { user } = useAuth();
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

    const handleRegister = async () => {
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

    const prefixes = ["เด็กหญิง", "เด็กชาย", "นาย", "นางสาว"];
    const educationLevels = ["ม. 2", "ม. 3", "ม. 4", "ม. 5", "ม. 6"];

    const getDefaultValues = (): ApplicantFormData => ({
        prefix: "",
        studentName: "",
        educationLevel: "",
        schoolName: "",
        foodAllergy: "",
        parentName: "",
        parentEmail: "",
        backupEmail: "",
        useUserEmail: false,
    });

    const {
        control,
        handleSubmit,
        formState: { errors },
        watch,
        setValue,
        reset,
    } = useForm<ApplicantFormData>({
        resolver: zodResolver(applicantSchema),
        defaultValues: getDefaultValues(),
    });

    const useUserEmailValue = watch("useUserEmail");
    const selectedPrefix = watch("prefix");
    const selectedEducationLevel = watch("educationLevel");

    const handleUseUserEmailChange = (checked: boolean) => {
        const userEmail = user?.email

        setValue("useUserEmail", checked);
        if (checked && userEmail) {
            setValue("parentEmail", userEmail, { shouldValidate: true });
            setValue("backupEmail", userEmail, { shouldValidate: true });
        } else {
            setValue("parentEmail", "", { shouldValidate: false });
            setValue("backupEmail", "", { shouldValidate: false });
        }
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
                <ModalHeader className="flex items-center rounded-xl gap-3 bg-gradient-to-r from-blue-50 to-pink-50">
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
                                                                {getEducationLevelText(
                                                                    profile.education_level
                                                                )}
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

                    <Card className="bg-pink-50 border-pink-100">
                        <CardBody className="gap-4">
                            <div className="flex items-center gap-2">
                                <GraduationCap className="w-5 h-5 text-pink-500" />
                                <h3 className="text-lg font-semibold text-gray-900">
                                    ข้อมูลนักเรียน
                                </h3>
                            </div>

                            {/* Prefix */}
                            <Controller
                                name="prefix"
                                control={control}
                                render={({ field }) => (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            คำนำหน้า <span className="text-red-500">*</span>
                                        </label>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                            {prefixes.map((prefix) => (
                                                <Button
                                                    key={prefix}
                                                    type="button"
                                                    variant={
                                                        selectedPrefix === prefix
                                                            ? "solid"
                                                            : "bordered"
                                                    }
                                                    onPress={() => field.onChange(prefix)}
                                                    className={
                                                        selectedPrefix === prefix
                                                            ? "bg-pink-400 text-white font-medium"
                                                            : "font-medium"
                                                    }
                                                >
                                                    {prefix}
                                                </Button>
                                            ))}
                                        </div>
                                        {errors.prefix && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {errors.prefix.message}
                                            </p>
                                        )}
                                    </div>
                                )}
                            />

                            {/* Student Name */}
                            <Controller
                                name="studentName"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        labelPlacement="outside"
                                        label="ชื่อ-นามสกุลของนักเรียน (ภาษาไทย)"
                                        placeholder="ระบุชื่อ-นามสกุลเป็นภาษาไทย"
                                        isRequired
                                        isInvalid={!!errors.studentName}
                                        errorMessage={errors.studentName?.message}
                                        variant="bordered"
                                    />
                                )}
                            />

                            {/* Education Level */}
                            <Controller
                                name="educationLevel"
                                control={control}
                                render={({ field }) => (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            ระดับการศึกษาของนักเรียน{" "}
                                            <span className="text-red-500">*</span>
                                        </label>
                                        <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                                            {educationLevels.map((level) => (
                                                <Button
                                                    key={level}
                                                    type="button"
                                                    variant={
                                                        selectedEducationLevel === level
                                                            ? "solid"
                                                            : "bordered"
                                                    }
                                                    onPress={() => field.onChange(level)}
                                                    className={
                                                        selectedEducationLevel === level
                                                            ? "bg-pink-400 text-white font-medium"
                                                            : "font-medium"
                                                    }
                                                >
                                                    {level}
                                                </Button>
                                            ))}
                                        </div>
                                        {errors.educationLevel && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {errors.educationLevel.message}
                                            </p>
                                        )}
                                    </div>
                                )}
                            />

                            {/* School Name */}
                            <Controller
                                name="schoolName"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        labelPlacement="outside"
                                        label="ชื่อโรงเรียนที่กำลังศึกษาอยู่"
                                        placeholder="โปรดสะกดชื่อโรงเรียนให้ถูกต้อง"
                                        isRequired
                                        isInvalid={!!errors.schoolName}
                                        errorMessage={errors.schoolName?.message}
                                        variant="bordered"
                                        startContent={<School className="w-5 h-5 text-gray-400" />}
                                    />
                                )}
                            />

                            {/* Food Allergy */}
                            <Controller
                                name="foodAllergy"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        labelPlacement="outside"
                                        label="การแพ้อาหาร"
                                        placeholder="ระบุอาหารที่แพ้ (ถ้ามี)"
                                        variant="bordered"
                                        startContent={
                                            <UtensilsCrossed className="w-5 h-5 text-gray-400" />
                                        }
                                    />
                                )}
                            />
                        </CardBody>
                    </Card>

                    {/* Parent Information Section */}
                    <Card className="bg-pink-50 border-pink-100">
                        <CardBody className="gap-4">
                            <div className="flex items-center gap-2">
                                <User className="w-5 h-5 text-pink-500" />
                                <h3 className="text-lg font-semibold text-gray-900">
                                    ข้อมูลผู้ปกครอง
                                </h3>
                            </div>
                            <span className="text-red-400 text-sm text-center">
                                ** หากเป็นผู้สมัครเองให้กรอกเป็นข้อมูลของตนเอง **
                            </span>
                            {/* Use User Email Checkbox */}
                            {user?.email && (
                                <Controller
                                    name="useUserEmail"
                                    control={control}
                                    render={({ field }) => (
                                        <Checkbox
                                            isSelected={field.value}
                                            onValueChange={handleUseUserEmailChange}
                                            classNames={{
                                                wrapper: "after:bg-pink-400",
                                                label: "text-sm md:text-base",
                                            }}
                                        >
                                            ใช้อีเมลของฉัน ({user?.email})
                                        </Checkbox>
                                    )}
                                />
                            )}

                            {/* Parent Name */}
                            <Controller
                                name="parentName"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        label="ชื่อผู้ปกครอง"
                                        placeholder="โปรดสะกดชื่อให้ถูกต้อง"
                                        isRequired
                                        isInvalid={!!errors.parentName}
                                        errorMessage={errors.parentName?.message}
                                        variant="bordered"
                                    />
                                )}
                            />

                            {/* Parent Email */}
                            <Controller
                                name="parentEmail"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        type="email"
                                        label="อีเมลของผู้ปกครอง"
                                        placeholder="example@email.com"
                                        isRequired={!useUserEmailValue}
                                        isInvalid={!!errors.parentEmail}
                                        errorMessage={errors.parentEmail?.message}
                                        variant="bordered"
                                        isDisabled={useUserEmailValue}
                                        startContent={<Mail className="w-5 h-5 text-gray-400" />}
                                    />
                                )}
                            />

                            {/* Backup Email */}
                            <Controller
                                name="backupEmail"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        type="email"
                                        label="อีเมลสำรองของผู้ปกครอง (ถ้ามี) หรืออีเมลนักเรียน"
                                        placeholder="backup@email.com"
                                        isRequired={!useUserEmailValue}
                                        isInvalid={!!errors.backupEmail}
                                        errorMessage={errors.backupEmail?.message}
                                        variant="bordered"
                                        isDisabled={useUserEmailValue}
                                        startContent={<Mail className="w-5 h-5 text-gray-400" />}
                                    />
                                )}
                            />
                        </CardBody>
                    </Card>
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
                            onPress={handleRegister}
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

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
    Input,
    Checkbox,
    CheckboxGroup,
    Radio,
    RadioGroup,
    Image
} from "@heroui/react";
import {
    GraduationCap,
    AlertCircle,
    School,
    UtensilsCrossed,
    User,
    Mail,
    Upload,
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { api } from "@/services";
import { toast } from "sonner";
import type { StudentInformation } from "@/services/api/StudentInformationService";
import { Controller, useForm } from "react-hook-form";
import { type ApplicantFormData, applicantSchema } from "../profile/AddApplicantModal";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hooks/useAuth";
import type {
    ActivityScheduleDetail,
    ActivityScheduleWithUsers,
} from "@/services/api/ActivityService";
import dayjs from "dayjs";
import "dayjs/locale/th";
import generatePayload from "promptpay-qr";
import { QRCodeSVG } from "qrcode.react";

dayjs.locale("th");

const PROMPTPAY_NUMBER = process.env.NEXT_PUBLIC_ACCOUNT_NUMBER;

type ScheduleItem = ActivityScheduleDetail | ActivityScheduleWithUsers;

interface StudentInfoOption {
    id: string;
    prefix: string;
    full_name: string;
    education_level: number;
    school: string;
    food_allergies: string | null;
    parent_name: string;
    parent_email: string;
    secondary_email: string | null;
    phone_number: string | null;
}

interface ActivityRegistrationModalProps {
    isOpen: boolean;
    onClose: () => void;
    activityId: string;
    activityTitle: string;
    schedules: ScheduleItem[];
    onSuccess?: () => void;
}

const educationLevelMap: Record<number, string> = {
    2: "ม. 2",
    3: "ม. 3",
    4: "ม. 4",
    5: "ม. 5",
    6: "ม. 6",
};

const educationLevelToNumber: Record<string, number> = {
    "ม. 2": 2,
    "ม. 3": 3,
    "ม. 4": 4,
    "ม. 5": 5,
    "ม. 6": 6,
};

function getAvailableSpots(schedule: ScheduleItem): number {
    if ("available_spots" in schedule) return schedule.available_spots;
    return Math.max(0, schedule.max_users - schedule.users_registered);
}

function formatScheduleLabel(schedule: ScheduleItem): string {
    const d = dayjs(schedule.event_start_at);
    const dayName = d.format("dddd");
    const date = d.format("D");
    const month = d.format("MMMM");
    const year = d.year() + 543;
    const time = d.format("HH:mm");
    return `สมัครกิจกรรมปฏิบัติการวัน${dayName}ที่ ${date} ${month} พ.ศ. ${year} เวลา ${time} น. (${schedule.price.toLocaleString()} บาท)`;
}

export function ActivityRegistrationModal({
    isOpen,
    onClose,
    activityId,
    activityTitle,
    schedules,
    onSuccess,
}: ActivityRegistrationModalProps) {
    const { user } = useAuth();
    const [step, setStep] = useState(1);
    const [studentInfo, setStudentInfo] = useState<StudentInformation | null>(null);
    const [studentInfos, setStudentInfos] = useState<StudentInfoOption[]>([]);
    const [hasProfile, setHasProfile] = useState<boolean | null>(null);
    const [isFetching, setIsFetching] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isCreatingProfile, setIsCreatingProfile] = useState(false);
    const [selectedScheduleIds, setSelectedScheduleIds] = useState<string[]>([]);
    const [slipFile, setSlipFile] = useState<File | null>(null);
    const [slipPreview, setSlipPreview] = useState<string | null>(null);
    const [selectedProfileId, setSelectedProfileId] = useState<string | "new">("new");

    const prefixes = ["เด็กหญิง", "เด็กชาย", "นาย", "นางสาว"];
    const educationLevels = ["ม. 2", "ม. 3", "ม. 4", "ม. 5", "ม. 6"];

    const {
        control,
        handleSubmit,
        formState: { errors },
        watch,
        setValue,
        reset,
    } = useForm<ApplicantFormData>({
        resolver: zodResolver(applicantSchema),
        defaultValues: {
            prefix: "",
            studentName: "",
            educationLevel: "",
            schoolName: "",
            foodAllergy: "",
            parentName: "",
            parentEmail: "",
            backupEmail: "",
            useUserEmail: false,
            parentTel: "",
        },
    });

    const useUserEmailValue = watch("useUserEmail");
    const selectedPrefix = watch("prefix");
    const selectedEducationLevel = watch("educationLevel");

    const totalPrice = useMemo(() => {
        return schedules
            .filter((s) => selectedScheduleIds.includes(s.id))
            .reduce((sum, s) => sum + s.price, 0);
    }, [selectedScheduleIds, schedules]);

    const qrPayload = useMemo(() => {
        if (!PROMPTPAY_NUMBER || totalPrice <= 0) return "";
        return generatePayload(PROMPTPAY_NUMBER, { amount: totalPrice });
    }, [totalPrice]);

    useEffect(() => {
        if (isOpen) {
            setStep(1);
            setSelectedScheduleIds([]);
            setSlipFile(null);
            setSlipPreview(null);
            setStudentInfo(null);
            setStudentInfos([]);
            setHasProfile(null);
            setSelectedProfileId("new");
            reset();
            fetchStudentProfiles();
        }
    }, [isOpen]);

    const fetchStudentProfiles = async () => {
        setIsFetching(true);
        try {
            const data = await api.studentInformationService.getAllStudentInformation();
            if (data.length > 0) {
                setStudentInfos(data);
                setStudentInfo(data[0]);
                setHasProfile(true);
                setSelectedProfileId(data[0].id);
            } else {
                setHasProfile(false);
                setSelectedProfileId("new");
            }
        } catch {
            toast.error("ไม่สามารถดึงข้อมูลนักเรียนได้");
            setHasProfile(false);
            setSelectedProfileId("new");
        } finally {
            setIsFetching(false);
        }
    };

    const handleSaveProfile = async (data: ApplicantFormData) => {
        setIsCreatingProfile(true);
        try {
            const payload = {
                prefix: data.prefix,
                full_name: data.studentName,
                education_level: educationLevelToNumber[data.educationLevel] ?? 2,
                school: data.schoolName,
                food_allergies: data.foodAllergy || undefined,
                parent_name: data.parentName,
                parent_email: data.parentEmail,
                secondary_email: data.backupEmail || undefined,
                phone_number: data.parentTel,
            };

            const result = await api.studentInformationService.createStudentInformation(payload);
            toast.success("บันทึกข้อมูลสำเร็จ");

            const infos = await api.studentInformationService.getAllStudentInformation();
            setStudentInfos(infos);
            setStudentInfo(infos[infos.length - 1]);
            setHasProfile(true);
            setSelectedProfileId(infos[infos.length - 1].id);
            setStep(2);
        } catch (error: unknown) {
            const err = error as { message?: string };
            toast.error(err.message || "เกิดข้อผิดพลาดในการบันทึกข้อมูล");
        } finally {
            setIsCreatingProfile(false);
        }
    };

    const handleUseUserEmailChange = (checked: boolean) => {
        const userEmail = user?.email;
        setValue("useUserEmail", checked);
        if (checked && userEmail) {
            setValue("parentEmail", userEmail, { shouldValidate: true });
            setValue("backupEmail", userEmail, { shouldValidate: true });
        } else {
            setValue("parentEmail", "", { shouldValidate: false });
            setValue("backupEmail", "", { shouldValidate: false });
        }
    };

    const handleSlipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSlipFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setSlipPreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleFinalSubmit = async () => {
        const selectedStudent = studentInfos.find(s => s.id === selectedProfileId);
        if (!selectedStudent && selectedProfileId !== "new") return;
        if (selectedScheduleIds.length === 0) return;

        setIsSubmitting(true);
        try {
            let studentInfoId: string;

            if (selectedProfileId === "new") {
                // Create new profile first
                const formData = watch();
                const payload = {
                    prefix: formData.prefix,
                    full_name: formData.studentName,
                    education_level: educationLevelToNumber[formData.educationLevel] ?? 2,
                    school: formData.schoolName,
                    food_allergies: formData.foodAllergy || undefined,
                    parent_name: formData.parentName,
                    parent_email: formData.parentEmail,
                    secondary_email: formData.backupEmail || undefined,
                    phone_number: formData.parentTel,
                };
                await api.studentInformationService.createStudentInformation(payload);
                const infos = await api.studentInformationService.getAllStudentInformation();
                studentInfoId = infos[infos.length - 1].id;
            } else {
                studentInfoId = selectedProfileId as string;
            }

            await api.activityService.joinActivity(activityId, {
                student_information_id: studentInfoId,
                schedule_ids: selectedScheduleIds,
                slip: slipFile || undefined,
            });
            toast.success("สมัครกิจกรรมสำเร็จ รอการอนุมัติ");
            onSuccess?.();
            onClose();
        } catch (error: unknown) {
            const err = error as { message?: string };
            toast.error(err.message || "เกิดข้อผิดพลาดในการสมัคร");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setStep(1);
        setSelectedScheduleIds([]);
        setSlipFile(null);
        setSlipPreview(null);
        onClose();
    };

    const renderStepIndicator = () => (
        <div className="flex items-center justify-center gap-2 mb-4">
            {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center gap-2">
                    <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                            s === step
                                ? "bg-pink-400 text-white"
                                : s < step
                                ? "bg-pink-200 text-pink-600"
                                : "bg-gray-200 text-gray-400"
                        }`}
                    >
                        {s}
                    </div>
                    {s < 3 && (
                        <div
                            className={`w-8 h-0.5 ${
                                s < step ? "bg-pink-300" : "bg-gray-200"
                            }`}
                        />
                    )}
                </div>
            ))}
        </div>
    );

    const renderProfileRadio = (profile: StudentInfoOption) => (
        <div className="w-full">
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">
                        {profile.prefix} {profile.full_name}
                    </span>
                    <span className="text-sm text-gray-500">
                        ({educationLevelMap[profile.education_level] ?? `ม. ${profile.education_level}`})
                    </span>
                </div>
                <div className="text-sm text-gray-600">
                    {profile.school} | ผู้ปกครอง: {profile.parent_name}
                </div>
                {profile.food_allergies && (
                    <div className="text-sm text-orange-600">
                        แพ้อาหาร: {profile.food_allergies}
                    </div>
                )}
            </div>
        </div>
    );

    const renderNewProfileForm = (isDisabled: boolean = false) => (
        <div className="space-y-4">

            <Card className={`bg-pink-50 border-pink-100 ${isDisabled ? "opacity-60" : ""}`}>
                <CardBody className="gap-4">
                    <div className="flex items-center gap-2">
                        <GraduationCap className="w-5 h-5 text-pink-500" />
                        <h3 className="text-lg font-semibold text-gray-900">ข้อมูลนักเรียน</h3>
                    </div>

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
                                            variant={selectedPrefix === prefix ? "solid" : "bordered"}
                                            onPress={() => field.onChange(prefix)}
                                            isDisabled={isDisabled}
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
                                    <p className="text-red-500 text-sm mt-1">{errors.prefix.message}</p>
                                )}
                            </div>
                        )}
                    />

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
                                isDisabled={isDisabled}
                            />
                        )}
                    />

                    <Controller
                        name="educationLevel"
                        control={control}
                        render={({ field }) => (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    ระดับการศึกษาของนักเรียน <span className="text-red-500">*</span>
                                </label>
                                <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                                    {educationLevels.map((level) => (
                                        <Button
                                            key={level}
                                            type="button"
                                            variant={
                                                selectedEducationLevel === level ? "solid" : "bordered"
                                            }
                                            onPress={() => field.onChange(level)}
                                            isDisabled={isDisabled}
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
                                isDisabled={isDisabled}
                            />
                        )}
                    />

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
                                startContent={<UtensilsCrossed className="w-5 h-5 text-gray-400" />}
                                isDisabled={isDisabled}
                            />
                        )}
                    />
                </CardBody>
            </Card>

            <Card className={`bg-pink-50 border-pink-100 ${isDisabled ? "opacity-60" : ""}`}>
                <CardBody className="gap-4">
                    <div className="flex items-center gap-2">
                        <User className="w-5 h-5 text-pink-500" />
                        <h3 className="text-lg font-semibold text-gray-900">ข้อมูลผู้ปกครอง</h3>
                    </div>
                    <span className="text-red-400 text-sm text-center">
                        ** หากเป็นผู้สมัครเองให้กรอกเป็นข้อมูลของตนเอง **
                    </span>

                    {user?.email && (
                        <Controller
                            name="useUserEmail"
                            control={control}
                            render={({ field }) => (
                                <Checkbox
                                    isSelected={field.value}
                                    onValueChange={handleUseUserEmailChange}
                                    isDisabled={isDisabled}
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
                                isDisabled={isDisabled}
                            />
                        )}
                    />

                    <Controller
                        name="parentTel"
                        control={control}
                        render={({ field }) => (
                            <Input
                                {...field}
                                label="เบอร์โทร"
                                placeholder="โปรดใส่เบอร์โทร"
                                isRequired
                                inputMode="numeric"
                                isInvalid={!!errors.parentTel}
                                errorMessage={errors.parentTel?.message}
                                variant="bordered"
                                isDisabled={isDisabled}
                            />
                        )}
                    />

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
                                isDisabled={useUserEmailValue || isDisabled}
                                startContent={<Mail className="w-5 h-5 text-gray-400" />}
                            />
                        )}
                    />

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
                                isDisabled={useUserEmailValue || isDisabled}
                                startContent={<Mail className="w-5 h-5 text-gray-400" />}
                            />
                        )}
                    />
                </CardBody>
            </Card>
        </div>
    );

    const handleProfileSelection = (value: string) => {
        setSelectedProfileId(value);
        if (value !== "new") {
            const selected = studentInfos.find(s => s.id === value);
            if (selected) {
                setStudentInfo(selected as StudentInformation);
                // Pre-fill form with selected profile data (for reference, but disabled)
                reset({
                    prefix: selected.prefix,
                    studentName: selected.full_name,
                    educationLevel: educationLevelMap[selected.education_level] ?? "",
                    schoolName: selected.school,
                    foodAllergy: selected.food_allergies ?? "",
                    parentName: selected.parent_name,
                    parentEmail: selected.parent_email,
                    backupEmail: selected.secondary_email ?? "",
                    useUserEmail: false,
                    parentTel: selected.phone_number ?? "",
                });
            }
        } else {
            // Clear form for new entry
            reset({
                prefix: "",
                studentName: "",
                educationLevel: "",
                schoolName: "",
                foodAllergy: "",
                parentName: "",
                parentEmail: "",
                backupEmail: "",
                useUserEmail: false,
                parentTel: "",
            });
        }
    };

    const renderStep1 = () => {
        if (isFetching) {
            return (
                <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500" />
                </div>
            );
        }

        const isExistingSelected = selectedProfileId !== "new";

        return (
            <div className="space-y-4">
                {/* Profile Selection Radio Group */}
                <Card className="bg-blue-50 border-blue-100">
                    <CardBody className="gap-4">
                        <div className="flex items-center gap-2">
                            <User className="w-5 h-5 text-blue-500" />
                            <h3 className="text-lg font-semibold text-gray-900">เลือกผู้สมัคร</h3>
                        </div>

                        <RadioGroup
                            value={selectedProfileId}
                            onValueChange={handleProfileSelection}
                            className="gap-3"
                        >
                            {studentInfos.map((profile) => (
                                <Radio
                                    key={profile.id}
                                    value={profile.id}
                                    classNames={{
                                        wrapper: "after:bg-pink-400",
                                        base: "max-w-none",
                                    }}
                                >
                                    {renderProfileRadio(profile)}
                                </Radio>
                            ))}
                            <Radio
                                value="new"
                                classNames={{
                                    wrapper: "after:bg-pink-400",
                                    base: "max-w-none",
                                }}
                            >
                                <div className="flex items-center gap-2 py-1">
                                    <span className="font-medium text-gray-900">+ เพิ่มผู้สมัครใหม่</span>
                                </div>
                            </Radio>
                        </RadioGroup>
                    </CardBody>
                </Card>

                {/* Profile Form - Disabled when existing profile selected */}
                {renderNewProfileForm(isExistingSelected)}
            </div>
        );
    };

    const renderStep2 = () => (
        <div className="space-y-4">
            <p className="text-gray-600 text-sm">เลือกรอบที่ต้องการสมัคร (เลือกได้หลายรอบ)</p>
            <CheckboxGroup
                value={selectedScheduleIds}
                onValueChange={setSelectedScheduleIds}
                className=""
            >
                {schedules.map((schedule) => {
                    const spots = getAvailableSpots(schedule);
                    const isFull = spots <= 0;
                    return (
                        <Checkbox
                            key={schedule.id}
                            value={schedule.id}
                            isDisabled={isFull}
                            classNames={{
                                wrapper: "after:bg-pink-400",
                                label: "text-sm",
                                base: `p-3 border-2 rounded-lg mb-2 transition-colors w-full max-w-none ${
                                    selectedScheduleIds.includes(schedule.id)
                                        ? "border-pink-400 bg-pink-50"
                                        : "border-gray-200"
                                } ${isFull ? "opacity-50" : ""}`,
                            }}
                        >
                            <div>
                                <p className="font-medium">{formatScheduleLabel(schedule)}</p>
                                <p className={`text-xs mt-1 ${isFull ? "text-red-500" : "text-gray-500"}`}>
                                    {isFull
                                        ? "เต็มแล้ว"
                                        : `เหลือ ${spots} ที่`}
                                </p>
                            </div>
                        </Checkbox>
                    );
                })}
            </CheckboxGroup>
            {selectedScheduleIds.length > 0 && (
                <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600">
                            เลือก {selectedScheduleIds.length} รอบ
                        </span>
                        <span className="text-xl font-bold text-pink-500">
                            รวม {totalPrice.toLocaleString()} ฿
                        </span>
                    </div>
                </div>
            )}
        </div>
    );

    const renderStep3 = () => (
        <div className="space-y-4">
            {totalPrice > 0 ? (
                <>
                    <div className="flex flex-col items-center gap-3">
                        <p className="text-gray-600 text-sm">โอนเงินผ่านธนาคาร</p>
                        <div className="relative">
                            <div className="p-1 bg-gradient-to-br from-pink-400 to-pink-300 rounded-xl shadow-lg">
                                <div className="bg-white p-4 rounded-lg">
                                    <Image src="/bank.jpg" alt="bank" className="w-80"/>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-2xl p-4 w-full border border-pink-200 shadow-sm flex flex-col gap-1">
                            <div className="flex items-center justify-center gap-2 mb-1">
                                <div className="h-px flex-1 bg-pink-200" />
                                <p className="text-sm font-medium text-pink-400 tracking-wide">ธนาคารไทยพาณิชย์</p>
                                <div className="h-px flex-1 bg-pink-200" />
                            </div>

                            <p className="text-center text-sm text-gray-500">
                                รศ.ดร.ชัชวาล ใจซื่อกุล / รศ.ดร.สิทธิพร ภัทรดิลกรัตน์
                            </p>

                            <p className="text-center text-xs text-gray-400">สาขา สยามสแควร์</p>

                            <div className="mt-2 flex items-center justify-between bg-white/70 rounded-xl px-4 py-2 border border-pink-100">
                                <div className="text-sm font-mono font-medium text-gray-600 tracking-wider flex flex-col md:flex-row gap-2 items-start md:items-center">
                                    <span>เลขบัญชี: 414-147-848-7</span>
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText("414-147-848-7");
                                            // optional: toast หรือ state feedback
                                        }}
                                        className="flex items-center gap-1 text-xs text-pink-400 hover:text-pink-600 bg-pink-100 hover:bg-pink-200 transition-colors px-2 py-1 rounded-lg"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                        </svg>
                                        คัดลอก
                                    </button>
                                </div>
                                <div className="flex items-center gap-3">
                                    <p className="text-base font-bold text-pink-500">
                                        {totalPrice.toLocaleString()} ฿
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            อัพโหลดสลิปการโอนเงิน
                        </label>
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-pink-400 transition-colors bg-gray-50">
                            {slipPreview ? (
                                <img
                                    src={slipPreview}
                                    alt="slip preview"
                                    className="h-full object-contain rounded-lg"
                                />
                            ) : (
                                <div className="flex flex-col items-center gap-2 text-gray-500">
                                    <Upload className="w-8 h-8" />
                                    <span className="text-sm">คลิกเพื่อเลือกรูปสลิป</span>
                                </div>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleSlipChange}
                            />
                        </label>
                    </div>
                </>
            ) : (
                <div className="text-center py-4">
                    <p className="text-gray-600">กิจกรรมนี้ไม่มีค่าใช้จ่าย</p>
                </div>
            )}

            <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-gray-700 mb-2">สรุปการสมัคร</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                    {schedules
                        .filter((s) => selectedScheduleIds.includes(s.id))
                        .map((s) => (
                            <li key={s.id}>
                                - {dayjs(s.event_start_at).format("DD/MM/YYYY HH:mm")} ({s.price.toLocaleString()} ฿)
                            </li>
                        ))}
                </ul>
                <div className="mt-2 pt-2 border-t border-blue-200 flex justify-between">
                    <span className="font-medium">รวมทั้งหมด</span>
                    <span className="font-bold text-pink-500">{totalPrice.toLocaleString()} ฿</span>
                </div>
            </div>
        </div>
    );

    const renderFooter = () => {
        if (step === 1) {
            const isNewProfile = selectedProfileId === "new";

            // ถ้าเลือกสร้างใหม่ ต้องกรอก form ก่อน
            if (isNewProfile) {
                return (
                    <>
                        <Button color="default" variant="flat" onPress={handleClose}>
                            ยกเลิก
                        </Button>
                        <Button
                            className="bg-pink-400 text-white"
                            onPress={() => handleSubmit(handleSaveProfile)()}
                            isLoading={isCreatingProfile}
                        >
                            บันทึกและถัดไป
                        </Button>
                    </>
                );
            }

            // ถ้าเลือก profile ที่มีอยู่ ไป step 2 ได้เลย
            return (
                <>
                    <Button color="default" variant="flat" onPress={handleClose}>
                        ยกเลิก
                    </Button>
                    <Button
                        className="bg-pink-400 text-white"
                        onPress={() => setStep(2)}
                        isDisabled={!selectedProfileId || selectedProfileId === "new"}
                    >
                        ถัดไป
                    </Button>
                </>
            );
        }

        if (step === 2) {
            return (
                <>
                    <Button color="default" variant="flat" onPress={() => setStep(1)}>
                        ย้อนกลับ
                    </Button>
                    <Button
                        className="bg-pink-400 text-white"
                        onPress={() => setStep(3)}
                        isDisabled={selectedScheduleIds.length === 0}
                    >
                        ถัดไป
                    </Button>
                </>
            );
        }

        return (
            <>
                <Button color="default" variant="flat" onPress={() => setStep(2)} isDisabled={isSubmitting}>
                    ย้อนกลับ
                </Button>
                <Button
                    className="bg-pink-400 text-white"
                    onPress={handleFinalSubmit}
                    isLoading={isSubmitting}
                    isDisabled={isSubmitting || (totalPrice > 0 && !slipFile)}
                >
                    ยืนยันการสมัคร
                </Button>
            </>
        );
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
                    {renderStepIndicator()}
                    {step === 1 && renderStep1()}
                    {step === 2 && renderStep2()}
                    {step === 3 && renderStep3()}
                </ModalBody>

                <ModalFooter>{renderFooter()}</ModalFooter>
            </ModalContent>
        </Modal>
    );
}

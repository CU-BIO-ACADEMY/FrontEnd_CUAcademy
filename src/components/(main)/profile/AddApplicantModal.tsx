"use client";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Input,
    Checkbox,
    Card,
    CardBody,
    Form,
} from "@heroui/react";
import { UserPlus, GraduationCap, School, Mail, User, UtensilsCrossed, Pencil } from "lucide-react";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";

// Zod Schema
const applicantSchema = z
    .object({
        prefix: z.string().min(1, "กรุณาเลือกคำนำหน้า"),
        studentName: z.string().min(1, "กรุณากรอกชื่อ-นามสกุลนักเรียน"),
        educationLevel: z.string().min(1, "กรุณาเลือกระดับการศึกษา"),
        schoolName: z.string().min(1, "กรุณากรอกชื่อโรงเรียน"),
        foodAllergy: z.string(),
        parentName: z.string().min(1, "กรุณากรอกชื่อผู้ปกครอง"),
        parentEmail: z.string().email("รูปแบบอีเมลไม่ถูกต้อง").or(z.literal("")),
        backupEmail: z.string().email("รูปแบบอีเมลไม่ถูกต้อง").or(z.literal("")),
        useUserEmail: z.boolean(),
    })
    .refine(
        (data) => {
            if (!data.useUserEmail) {
                return data.parentEmail.length > 0;
            }
            return true;
        },
        { message: "กรุณากรอกอีเมลผู้ปกครอง", path: ["parentEmail"] }
    )
    .refine(
        (data) => {
            if (!data.useUserEmail) {
                return data.backupEmail.length > 0;
            }
            return true;
        },
        { message: "กรุณากรอกอีเมลสำรอง", path: ["backupEmail"] }
    );

export type ApplicantFormData = z.infer<typeof applicantSchema>;

interface AddApplicantModalProps {
    isOpen: boolean;
    onClose: () => void;
    userEmail?: string;
    onSubmit: (data: ApplicantFormData) => Promise<void>;
    isLoading?: boolean;
    defaultValues?: Partial<ApplicantFormData>;
    mode?: "create" | "edit";
}

export function AddApplicantModal({
    isOpen,
    onClose,
    userEmail,
    onSubmit,
    isLoading = false,
    defaultValues,
    mode = "create",
}: AddApplicantModalProps) {
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
        ...defaultValues,
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

    // Reset form when modal opens with defaultValues (for edit mode)
    useEffect(() => {
        if (isOpen) {
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
                ...defaultValues,
            });
        }
    }, [isOpen, defaultValues, reset]);

    const useUserEmailValue = watch("useUserEmail");
    const selectedPrefix = watch("prefix");
    const selectedEducationLevel = watch("educationLevel");

    const handleUseUserEmailChange = (checked: boolean) => {
        setValue("useUserEmail", checked);
        if (checked && userEmail) {
            setValue("parentEmail", userEmail, { shouldValidate: true });
            setValue("backupEmail", userEmail, { shouldValidate: true });
        } else {
            setValue("parentEmail", "", { shouldValidate: false });
            setValue("backupEmail", "", { shouldValidate: false });
        }
    };

    const handleSubmitForm = async (data: ApplicantFormData) => {
        await onSubmit(data);
        onClose();
        reset();
    };

    const handleClose = () => {
        onClose();
        reset();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            size="3xl"
            scrollBehavior="inside"
            classNames={{
                base: "max-h-[90vh]",
            }}
            placement="center"
        >
            <ModalContent className="w-full max-h-[85vh]">
                <Form
                    className="w-full flex flex-col overflow-hidden"
                    onSubmit={handleSubmit(handleSubmitForm)}
                >
                    <ModalHeader className="flex items-center w-full rounded-t-xl gap-3 bg-linear-to-r from-pink-100 to-pink-200 text-gray-800">
                        <div className="p-2 bg-white rounded-lg shadow-sm">
                            {mode === "edit" ? (
                                <Pencil className="w-6 h-6 text-pink-500" />
                            ) : (
                                <UserPlus className="w-6 h-6 text-pink-500" />
                            )}
                        </div>
                        <h2 className="text-2xl font-bold">
                            {mode === "edit" ? "แก้ไขข้อมูลผู้สมัคร" : "เพิ่มข้อมูลผู้สมัคร"}
                        </h2>
                    </ModalHeader>
                    <ModalBody className="py-6 w-full overflow-y-auto px-4 md:px-6">
                        <div className="space-y-6">
                            {/* Student Information Section */}
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
                                                startContent={
                                                    <School className="w-5 h-5 text-gray-400" />
                                                }
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
                                    <span className="text-red-400 text-sm text-center">** หากเป็นผู้สมัครเองให้กรอกเป็นข้อมูลของตนเอง **</span>
                                    {/* Use User Email Checkbox */}
                                    {userEmail && (
                                        <Controller
                                            name="useUserEmail"
                                            control={control}
                                            render={({ field }) => (
                                                <Checkbox
                                                    isSelected={field.value}
                                                    onValueChange={handleUseUserEmailChange}
                                                    classNames={{ wrapper: "after:bg-pink-400", label:"text-sm md:text-base" }}
                                                >
                                                    ใช้อีเมลของฉัน ({userEmail})
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
                                                startContent={
                                                    <Mail className="w-5 h-5 text-gray-400" />
                                                }
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
                                                startContent={
                                                    <Mail className="w-5 h-5 text-gray-400" />
                                                }
                                            />
                                        )}
                                    />
                                </CardBody>
                            </Card>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="default" variant="flat" onPress={handleClose} type="button">
                            ยกเลิก
                        </Button>
                        <Button
                            type="submit"
                            className="bg-pink-400 text-white"
                            isLoading={isLoading}
                            isDisabled={isLoading}
                        >
                            บันทึกข้อมูล
                        </Button>
                    </ModalFooter>
                </Form>
            </ModalContent>
        </Modal>
    );
}

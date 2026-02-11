"use client";
import { useEffect, useState, useCallback } from "react";
import { ProfileCard } from "@/components/(main)/profile/profileCard";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@heroui/react";
import { UserPlus, Users } from "lucide-react";
import {
    AddApplicantModal,
    type ApplicantFormData,
} from "@/components/(main)/profile/AddApplicantModal";
import { ApplicantCard } from "@/components/(main)/profile/ApplicantCard";
import { ActivityStats } from "@/components/(main)/profile/ActivityStats";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import { api } from "@/services";
import { Applicant, educationLevelMap, educationLevelReverseMap } from "@/types/applicant";
import { toast } from "sonner";

function ProfileContainer() {
    const { user } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [applicants, setApplicants] = useState<Applicant[]>([]);
    const [, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingApplicant, setEditingApplicant] = useState<Applicant | null>(null);
    const [modalMode, setModalMode] = useState<"create" | "edit">("create");
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [deletingApplicantId, setDeletingApplicantId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const fetchStudentInformation = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await api.studentInformationService.getAllStudentInformation();
            const mappedApplicants: Applicant[] = data.map((item) => ({
                id: item.id,
                prefix: item.prefix,
                studentName: item.full_name,
                educationLevel: educationLevelReverseMap[item.education_level],
                schoolName: item.school,
                foodAllergy: item.food_allergies || undefined,
                parentName: item.parent_name,
                parentEmail: item.parent_email,
                backupEmail: item.secondary_email || "",
                createdAt: new Date(item.created_at).toLocaleDateString("th-TH", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                }),
                parentTel: item.phone_number,
            }));
            setApplicants(mappedApplicants);
        } catch {
            setApplicants([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchStudentInformation();
    }, [fetchStudentInformation]);

    const handleSubmitApplicant = async (formData: ApplicantFormData) => {
        setIsSubmitting(true);
        try {
            const payload = {
                prefix: formData.prefix,
                full_name: formData.studentName,
                education_level: educationLevelMap[formData.educationLevel],
                school: formData.schoolName,
                food_allergies: formData.foodAllergy || undefined,
                parent_name: formData.parentName,
                parent_email: formData.parentEmail,
                secondary_email: formData.backupEmail || undefined,
                phone_number: formData.parentTel,
            };

            if (modalMode === "edit" && editingApplicant) {
                await api.studentInformationService.updateStudentInformation(editingApplicant.id, payload);
                toast.success("อัพเดทข้อมูลผู้สมัครสำเร็จ");
            } else {
                await api.studentInformationService.createStudentInformation(payload);
                toast.success("สร้างข้อมูลผู้สมัครสำเร็จ");
            }

            await fetchStudentInformation();
        } catch (error) {
            toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
            throw error;
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteApplicant = (id: string) => {
        setDeletingApplicantId(id);
        setIsConfirmModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!deletingApplicantId) return;

        setIsDeleting(true);
        try {
            await api.studentInformationService.deleteStudentInformation(deletingApplicantId);
            setApplicants((prev) => prev.filter((a) => a.id !== deletingApplicantId));
            toast.success("ลบข้อมูลผู้สมัครสำเร็จ");
            setIsConfirmModalOpen(false);
            setDeletingApplicantId(null);
        } catch {
            toast.error("เกิดข้อผิดพลาดในการลบข้อมูล");
        } finally {
            setIsDeleting(false);
        }
    };

    const handleCancelDelete = () => {
        setIsConfirmModalOpen(false);
        setDeletingApplicantId(null);
    };

    const handleEditApplicant = (applicant: Applicant) => {
        setEditingApplicant(applicant);
        setModalMode("edit");
        setIsModalOpen(true);
    };

    const handleOpenCreateModal = () => {
        setEditingApplicant(null);
        setModalMode("create");
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingApplicant(null);
    };

    const getEditDefaultValues = (): Partial<ApplicantFormData> | undefined => {
        if (!editingApplicant) return undefined;

        const useUserEmail =
            editingApplicant.parentEmail === user?.email &&
            editingApplicant.backupEmail === user?.email;

        return {
            prefix: editingApplicant.prefix,
            studentName: editingApplicant.studentName,
            educationLevel: editingApplicant.educationLevel,
            schoolName: editingApplicant.schoolName,
            foodAllergy: editingApplicant.foodAllergy || "",
            parentName: editingApplicant.parentName,
            parentEmail: editingApplicant.parentEmail,
            backupEmail: editingApplicant.backupEmail,
            useUserEmail,
            parentTel: editingApplicant.parentTel,
        };
    };

    return (
        <div className="min-h-screen overflow-y-auto md:p-6">
            <div className="max-w-7xl mx-auto space-y-6 pb-8">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-gray-900">โปรไฟล์</h1>
                </div>

                <ActivityStats
                    stats={[
                        { label: "กิจกรรมที่เข้าร่วมทั้งหมด", value: 12, change: "+3 เดือนนี้" },
                        {
                            label: "จำนวน Credit",
                            value: user?.balance || 0,
                            change: "+12 เดือนนี้",
                        },
                        {
                            label: "จำนวนข้อมูลผู้สมัคร",
                            value: applicants.length,
                            change: "",
                            changeColor: "text-blue-600",
                        },
                    ]}
                />

                <div className="flex gap-6 flex-col lg:flex-row">
                    <div className="flex-1 space-y-6">
                        <ProfileCard user={user} />

                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <Users className="w-6 h-6 text-blue-600" />
                                    <h2 className="text-xl font-semibold text-gray-900">
                                        ข้อมูลผู้สมัคร
                                    </h2>
                                </div>
                                <Button
                                    color="primary"
                                    onPress={handleOpenCreateModal}
                                    startContent={<UserPlus className="w-4 h-4" />}
                                    className="bg-gradient-to-r from-pink-400 to-pink-300 font-medium"
                                >
                                    เพิ่มผู้สมัคร
                                </Button>
                            </div>

                            {applicants.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                                        <Users className="w-8 h-8 text-gray-400" />
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                                        ยังไม่มีข้อมูลผู้สมัคร
                                    </h3>
                                    <p className="text-gray-500 mb-6">
                                        เริ่มต้นโดยการเพิ่มข้อมูลผู้สมัครคนแรกของคุณ
                                    </p>
                                    <Button
                                        color="primary"
                                        onPress={handleOpenCreateModal}
                                        startContent={<UserPlus className="w-5 h-5" />}
                                        size="lg"
                                    >
                                        เพิ่มผู้สมัครใหม่
                                    </Button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {applicants.map((applicant) => (
                                        <ApplicantCard
                                            key={applicant.id}
                                            applicant={applicant}
                                            onEdit={handleEditApplicant}
                                            onDelete={handleDeleteApplicant}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <AddApplicantModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                userEmail={user?.email}
                onSubmit={handleSubmitApplicant}
                isLoading={isSubmitting}
                defaultValues={getEditDefaultValues()}
                mode={modalMode}
            />

            <ConfirmModal
                isOpen={isConfirmModalOpen}
                onClose={handleCancelDelete}
                onConfirm={handleConfirmDelete}
                title="ยืนยันการลบข้อมูล"
                message="คุณต้องการลบข้อมูลผู้สมัครนี้หรือไม่? การดำเนินการนี้ไม่สามารถย้อนกลับได้"
                confirmText="ลบข้อมูล"
                cancelText="ยกเลิก"
                confirmColor="danger"
                isLoading={isDeleting}
            />
        </div>
    );
}

export default ProfileContainer;

"use client";
import { useState } from "react";
import { ProfileCard } from "@/components/(main)/profile/profileCard";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@heroui/react";
import {
    Settings,
    UserPlus,
    Users
} from "lucide-react";
import { AddApplicantModal } from "@/components/(main)/profile/AddApplicantModal";
import { ApplicantCard } from "@/components/(main)/profile/ApplicantCard";
import { ActivityStats } from "@/components/(main)/profile/ActivityStats";

interface Applicant {
    id: string;
    prefix: string;
    studentName: string;
    educationLevel: string;
    schoolName: string;
    parentName: string;
    parentEmail: string;
    backupEmail: string;
    createdAt: string;
    status?: "pending" | "approved" | "rejected";
}

function ProfileContainer() {
    const { user } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Mock data - replace with real data from API
    const [applicants, setApplicants] = useState<Applicant[]>([
        {
            id: "1",
            prefix: "เด็กหญิง",
            studentName: "สมหญิง ใจดี",
            educationLevel: "ม. 3",
            schoolName: "โรงเรียนสาธิตจุฬาลงกรณ์มหาวิทยาลัย ฝ่ายมัธยม",
            parentName: "นางสาวสมศรี ใจดี",
            parentEmail: "somsri@email.com",
            backupEmail: "somying@student.email.com",
            createdAt: "15 มกราคม 2567",
            status: "approved"
        },
        {
            id: "2",
            prefix: "นาย",
            studentName: "สมชาย รักเรียน",
            educationLevel: "ม. 5",
            schoolName: "โรงเรียนเตรียมอุดมศึกษา",
            parentName: "นายสมศักดิ์ รักเรียน",
            parentEmail: "somsak@email.com",
            backupEmail: "somchai@student.email.com",
            createdAt: "20 มกราคม 2567",
            status: "pending"
        }
    ]);

    const handleDeleteApplicant = (id: string) => {
        if (confirm("คุณต้องการลบข้อมูลผู้สมัครนี้หรือไม่?")) {
            setApplicants(prev => prev.filter(app => app.id !== id));
        }
    };

    const handleEditApplicant = (applicant: Applicant) => {
        // Open modal with pre-filled data
        setIsModalOpen(true);
        // You can add logic to populate the form with existing data
    };

    return (
        <div className="min-h-screen overflow-y-auto p-6">
            <div className="max-w-7xl mx-auto space-y-6 pb-8">
                {/* Header Section */}
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-gray-900">โปรไฟล์</h1>
                </div>

                <ActivityStats stats={[
                    { label: "Total Projects", value: 12, change: "+3 this month" },
                    { label: "Tasks Completed", value: 48, change: "+12 this week" },
                    { label: "Team Members", value: 8, change: "Active now", changeColor: "text-blue-600" },
                ]} />

                {/* Main Content */}
                <div className="flex gap-6 flex-col lg:flex-row">

                    {/* Right Content Area */}
                    <div className="flex-1 space-y-6">
                        {/* Personal Information */}
                        <ProfileCard user={user} />

                        {/* Applicants Section */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <Users className="w-6 h-6 text-blue-600" />
                                    <h2 className="text-xl font-semibold text-gray-900">
                                        ข้อมูลผู้สมัคร
                                    </h2>
                                </div>
                                <Button
                                    color="primary"
                                    onPress={() => setIsModalOpen(true)}
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
                                        onPress={() => setIsModalOpen(true)}
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

            {/* Add Applicant Modal */}
            <AddApplicantModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                userEmail={user?.email}
            />
        </div>
    );
}

export default ProfileContainer;

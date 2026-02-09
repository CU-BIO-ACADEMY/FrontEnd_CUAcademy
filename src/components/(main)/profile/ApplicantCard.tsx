"use client";
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Chip,
    Button,
    Divider
} from "@heroui/react";
import { GraduationCap, School, User, Mail, Calendar, Edit, Trash2, UtensilsCrossed } from "lucide-react";

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
    foodAllergy?: string;
    status?: "pending" | "approved" | "rejected";
}

interface ApplicantCardProps {
    applicant: Applicant;
    onEdit?: (applicant: Applicant) => void;
    onDelete?: (id: string) => void;
}

export function ApplicantCard({ applicant, onEdit, onDelete }: ApplicantCardProps) {
    const getStatusColor = (status?: string) => {
        switch (status) {
            case "approved":
                return "success";
            case "rejected":
                return "danger";
            default:
                return "warning";
        }
    };

    const getStatusText = (status?: string) => {
        switch (status) {
            case "approved":
                return "มีกิจกรรมแล้ว";
            case "rejected":
                return "ยังไม่มีกิจกรรม";
            default:
                return "ยังไม่มีกิจกรรม";
        }
    };

    return (
        <Card className="w-full ring-1 ring-pink-200 shadow-md shadow-pink-100">
            <CardHeader className="flex-col items-start gap-3 bg-linear-to-r from-pink-100 to-pink-200 p-4">
                <div className="flex w-full items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded-lg shadow-sm">
                            <GraduationCap className="w-6 h-6 text-pink-500" />
                        </div>
                        <div>
                            <h3 className="text-gray-800 font-bold text-lg">
                                {applicant.prefix} {applicant.studentName}
                            </h3>
                            <p className="text-pink-500 text-sm">{applicant.educationLevel}</p>
                        </div>
                    </div>
                    <Chip
                        color={getStatusColor(applicant.status)}
                        size="sm"
                        variant="flat"
                    >
                        {getStatusText(applicant.status)}
                    </Chip>
                </div>
            </CardHeader>

            <CardBody className="gap-4 p-5">
                {/* School Information */}
                <div className="flex items-start gap-3">
                    <div className="p-2 bg-pink-50 rounded-lg">
                        <School className="w-5 h-5 text-pink-400" />
                    </div>
                    <div className="flex-1">
                        <p className="text-sm text-gray-500 mb-1">โรงเรียน</p>
                        <p className="text-gray-900 font-medium">{applicant.schoolName}</p>
                    </div>
                </div>

                <Divider />

                {/* Parent Information */}
                <div className="flex items-start gap-3">
                    <div className="p-2 bg-pink-50 rounded-lg">
                        <User className="w-5 h-5 text-pink-400" />
                    </div>
                    <div className="flex-1">
                        <p className="text-sm text-gray-500 mb-1">ผู้ปกครอง</p>
                        <p className="text-gray-900 font-medium">{applicant.parentName}</p>
                    </div>
                </div>

                <div className="flex items-start gap-3">
                    <div className="p-2 bg-pink-50 rounded-lg">
                        <Mail className="w-5 h-5 text-pink-400" />
                    </div>
                    <div className="flex-1">
                        <p className="text-sm text-gray-500 mb-1">อีเมลหลัก</p>
                        <p className="text-gray-900 text-sm break-all">{applicant.parentEmail}</p>
                    </div>
                </div>

                <div className="flex items-start gap-3">
                    <div className="p-2 bg-pink-50 rounded-lg">
                        <Mail className="w-5 h-5 text-pink-400" />
                    </div>
                    <div className="flex-1">
                        <p className="text-sm text-gray-500 mb-1">อีเมลสำรอง</p>
                        <p className="text-gray-900 text-sm break-all">{applicant.backupEmail}</p>
                    </div>
                </div>

                <div className="flex items-start gap-3">
                    <div className="p-2 bg-pink-50 rounded-lg">
                        <UtensilsCrossed className="w-5 h-5 text-pink-400" />
                    </div>
                    <div className="flex-1">
                        <p className="text-sm text-gray-500 mb-1">การแพ้อาหาร</p>
                        <p className="text-gray-900 text-sm">{applicant.foodAllergy || "ไม่มี"}</p>
                    </div>
                </div>

                <div className="flex items-start gap-3">
                    <div className="p-2 bg-pink-50 rounded-lg">
                        <Calendar className="w-5 h-5 text-pink-400" />
                    </div>
                    <div className="flex-1">
                        <p className="text-sm text-gray-500 mb-1">วันที่สมัคร</p>
                        <p className="text-gray-900 text-sm">{applicant.createdAt}</p>
                    </div>
                </div>
                {status === "approved" && (
                    <div className="w-full flex bg-pink-500/10 rounded-md ring ring-pink-300 p-4 items-center justify-between">
                        <div>
                            <p className=" text-sm">กิจกรรมที่รับ</p>
                            <p className="text-xl w-40 line-clamp-1">{`awdwafgwad`}</p>
                        </div>
                        <div>
                            <Button variant="shadow" color="secondary" size="md">ลายละเอียด</Button>
                        </div>
                    </div>
                ) }
            </CardBody>

            <CardFooter className="gap-2 px-5 pb-5">
                {onEdit && (
                    <Button
                        variant="flat"
                        onPress={() => onEdit(applicant)}
                        startContent={<Edit className="w-4 h-4" />}
                        className="flex-1 bg-pink-100 text-pink-600 hover:bg-pink-200"
                    >
                        แก้ไข
                    </Button>
                )}
                {onDelete && (
                    <Button
                        color="danger"
                        variant="flat"
                        onPress={() => onDelete(applicant.id)}
                        startContent={<Trash2 className="w-4 h-4" />}
                        className="flex-1"
                    >
                        ลบ
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
}

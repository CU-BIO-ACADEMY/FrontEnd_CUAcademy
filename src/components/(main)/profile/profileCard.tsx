'use client'
import {
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Shield,
} from "lucide-react";
import { Role } from "@/types/user";
import type { User as UserType } from "@/types/user";
import { Button } from "@heroui/react";

interface ProfileCardProps {
    user: UserType | null;
}

export function ProfileCard({ user }: ProfileCardProps) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                    ข้อมูลส่วนตัวของบัญชีนี้
                </h2>
                <Button variant="light" color="primary" >
                    เพิ่มเบอร์ติดต่อ
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-600">
                        <User className="w-4 h-4" />
                        ชื่อ - นามสกุล
                    </label>
                    <p className="text-gray-900 pl-6">{user?.display_name || "Not set"}</p>
                </div>

                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-600">
                        <Mail className="w-4 h-4" />
                        Email
                    </label>
                    <p className="text-gray-900 pl-6">{user?.email || "Not set"}</p>
                </div>

                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-600">
                        <Phone className="w-4 h-4" />
                        เบอร์โทร
                    </label>
                    <p className="text-gray-900 pl-6">+66 XX XXX XXXX</p>
                </div>

                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-600">
                        <MapPin className="w-4 h-4" />
                        Location
                    </label>
                    <p className="text-gray-900 pl-6">Bangkok, Thailand</p>
                </div>

                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-600">
                        <Calendar className="w-4 h-4" />
                        Member Since
                    </label>
                    <p className="text-gray-900 pl-6">January 2024</p>
                </div>

                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-600">
                        <Shield className="w-4 h-4" />
                        Role
                    </label>
                    <p className="text-gray-900 pl-6">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                            {user?.role || Role.MEMBER}
                        </span>
                    </p>
                </div>
            </div>
        </div>
    )
}

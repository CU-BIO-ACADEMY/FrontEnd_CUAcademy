"use client";

import React, { useState } from "react";
import { ActivityStats } from "@/components/(main)/profile/ActivityStats";
import {
    MemberRegistrationTable,
    type Registrant,
} from "@/components/(main)/admin/MemberRegistrationTable";
import { toast } from "sonner";

const mockRegistrants: Registrant[] = [
    {
        id: "1",
        full_name: "สมชาย ใจดี",
        email: "somchai@example.com",
        school: "โรงเรียนสาธิตจุฬาฯ",
        education_level: "ม. 4",
        registered_at: "2025-06-01T10:00:00Z",
        status: "approved",
    },
    {
        id: "2",
        full_name: "สมหญิง รักเรียน",
        email: "somying@example.com",
        school: "โรงเรียนเตรียมอุดมศึกษา",
        education_level: "ม. 5",
        registered_at: "2025-06-02T14:30:00Z",
        status: "pending",
    },
    {
        id: "3",
        full_name: "วิชัย สุขสันต์",
        email: "wichai@example.com",
        school: "โรงเรียนบดินทรเดชา",
        education_level: "ม. 6",
        registered_at: "2025-06-03T09:15:00Z",
        status: "pending",
    },
    {
        id: "4",
        full_name: "พิมพ์ใจ แสนสุข",
        email: "pimjai@example.com",
        school: "โรงเรียนสาธิตจุฬาฯ",
        education_level: "ม. 3",
        registered_at: "2025-06-04T11:00:00Z",
        status: "approved",
    },
    {
        id: "5",
        full_name: "ธนากร เก่งกาจ",
        email: "thanakorn@example.com",
        school: "โรงเรียนสวนกุหลาบ",
        education_level: "ม. 4",
        registered_at: "2025-06-05T16:45:00Z",
        status: "pending",
    },
];

function AdminActivityDetail({ id }: { id: string }) {
    const [registrants, setRegistrants] = useState<Registrant[]>(mockRegistrants);

    const handleConfirm = (registrantId: string) => {
        setRegistrants((prev) =>
            prev.map((r) =>
                r.id === registrantId ? { ...r, status: "approved" as const } : r
            )
        );
        toast.success("อนุมัติผู้สมัครสำเร็จ");
    };

    const handleSendEmail = (registrantId: string) => {
        const registrant = registrants.find((r) => r.id === registrantId);
        if (registrant) {
            toast.success(`ส่งอีเมลไปยัง ${registrant.email} สำเร็จ`);
        }
    };

    const handleSendEmailAll = (ids: string[]) => {
        const emails = registrants
            .filter((r) => ids.includes(r.id))
            .map((r) => r.email);
        toast.success(`ส่งอีเมลไปยังผู้สมัครที่อนุมัติแล้วทั้งหมด ${emails.length} คน สำเร็จ`);
    };

    const handleDelete = (registrantId: string) => {
        setRegistrants((prev) => prev.filter((r) => r.id !== registrantId));
        toast.success("ลบผู้สมัครสำเร็จ");
    };

    const approvedCount = registrants.filter((r) => r.status === "approved").length;

    return (
        <div className="sm:p-6">
            <div className="text-xl pb-6">{id}</div>
            <ActivityStats
                stats={[
                    { label: "รายได้", value: 12, change: "" },
                    {
                        label: "จำนวนผู้สมัคร",
                        value: `${registrants.length} / ${20}`,
                        change: "",
                    },
                    {
                        label: "จำนวนผู้สละสิทธิ์",
                        value: 12,
                        change: "",
                        changeColor: "text-blue-600",
                    },
                ]}
            />

            <div className="mt-8">
                <h2 className="text-lg font-semibold mb-4">รายชื่อผู้สมัคร</h2>
                <MemberRegistrationTable
                    registrants={registrants}
                    onConfirm={handleConfirm}
                    onSendEmail={handleSendEmail}
                    onSendEmailAll={handleSendEmailAll}
                    onDelete={handleDelete}
                    formatEmail=""
                />
            </div>
        </div>
    );
}

export default AdminActivityDetail;

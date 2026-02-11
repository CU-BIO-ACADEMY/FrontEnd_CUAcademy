"use client";

import React, { useMemo, useCallback } from "react";
import { ActivityStats } from "@/components/(main)/profile/ActivityStats";
import {
    MemberRegistrationTable,
    type Registrant,
} from "@/components/(main)/admin/(slug)/MemberRegistrationTable";
import { toast } from "sonner";
import useSWR from "swr";
import { api } from "@/services";
import type { ActivityDetail, RegisteredUser } from "@/services/api/ActivityService";

const educationLevelMap: Record<number, string> = {
    2: "ม. 2",
    3: "ม. 3",
    4: "ม. 4",
    5: "ม. 5",
    6: "ม. 6",
};

const transformToRegistrants = (data: ActivityDetail | undefined): Registrant[] => {
    if (!data) return [];

    const studentMap = new Map<string, {
        registrationIds: string[];
        full_name: string;
        email: string;
        school: string;
        education_level: number;
        registered_at: string;
        event_dates: string[];
        statuses: ("pending" | "approved" | "rejected")[];
        slip_url: string | null;
        total_amount: number;
    }>();

    data.schedules.forEach((schedule) => {
        schedule.registered_users.forEach((user: RegisteredUser) => {
            if (!user.student_info || !user.user) return;

            const studentId = user.student_information_id;
            const existing = studentMap.get(studentId);

            if (existing) {
                // Add event date if not already exists
                if (!existing.event_dates.includes(schedule.event_start_at)) {
                    existing.event_dates.push(schedule.event_start_at);
                }
                existing.registrationIds.push(user.id);
                existing.statuses.push(user.payment_status);
                existing.total_amount += schedule.price;
            } else {
                studentMap.set(studentId, {
                    registrationIds: [user.id],
                    full_name: `${user.student_info.prefix} ${user.student_info.full_name}`,
                    email: user.user.email,
                    school: user.student_info.school,
                    education_level: user.student_info.education_level,
                    registered_at: user.created_at,
                    event_dates: [schedule.event_start_at],
                    statuses: [user.payment_status],
                    slip_url: user.payment_file_url,
                    total_amount: schedule.price,
                });
            }
        });
    });

    // Convert map to Registrant array
    return Array.from(studentMap.values()).map((student) => {
        // Determine status - if all rejected = rejected, any approved = approved, else pending
        const hasApproved = student.statuses.some((s) => s === "approved");
        const hasPending = student.statuses.some((s) => s === "pending");
        
        let status: "pending" | "approved" | "rejected";
        if (hasApproved) {
            status = "approved";
        } else if (!hasPending && student.statuses.every((s) => s === "rejected")) {
            status = "rejected";
        } else {
            status = "pending";
        }

        return {
            id: student.registrationIds[0], // Use first registration ID for actions
            full_name: student.full_name,
            email: student.email,
            school: student.school,
            education_level: educationLevelMap[student.education_level] ?? `ม. ${student.education_level}`,
            registered_at: student.registered_at,
            event_dates: student.event_dates,
            status,
            slip_url: student.slip_url,
            amount: student.total_amount,
        };
    });
};

function AdminActivityDetail({ id }: { id: string }) {
    const { data, isLoading, mutate } = useSWR<ActivityDetail>(`/api/activities/${id}`, () =>
        api.activityService.getActivityById(id)
    );

    const registrants = useMemo(() => {
        return transformToRegistrants(data);
    }, [data]);

    // Get first registration ID for a student (needed for API calls)
    const getRegistrationId = useCallback((registrantId: string): string | null => {
        if (!data) return null;
        
        for (const schedule of data.schedules) {
            const user = schedule.registered_users.find((u) => u.id === registrantId);
            if (user) return user.id;
        }
        return null;
    }, [data]);

    const handleConfirm = useCallback(async (registrantId: string) => {
        const registrationId = getRegistrationId(registrantId);
        if (!registrationId) {
            toast.error("ไม่พบข้อมูลการลงทะเบียน");
            return;
        }

        try {
            await api.activityService.updateRegistrationStatus(registrationId, "approved");
            toast.success("อนุมัติผู้สมัครสำเร็จ");
            mutate(); // Refresh data
        } catch (error) {
            toast.error("เกิดข้อผิดพลาดในการอนุมัติ");
        }
    }, [getRegistrationId, mutate]);

    const handleReject = useCallback(async (registrantId: string) => {
        const registrationId = getRegistrationId(registrantId);
        if (!registrationId) {
            toast.error("ไม่พบข้อมูลการลงทะเบียน");
            return;
        }

        try {
            await api.activityService.updateRegistrationStatus(registrationId, "rejected");
            toast.success("ปฏิเสธผู้สมัครสำเร็จ");
            mutate(); // Refresh data
        } catch (error) {
            toast.error("เกิดข้อผิดพลาดในการปฏิเสธ");
        }
    }, [getRegistrationId, mutate]);

    const handleSendEmail = useCallback((registrantId: string) => {
        const registrant = registrants.find((r) => r.id === registrantId);
        if (registrant) {
            toast.success(`ส่งอีเมลไปยัง ${registrant.email} สำเร็จ`);
        }
    }, [registrants]);

    const handleSendEmailAll = useCallback((ids: string[]) => {
        const emails = registrants.filter((r) => ids.includes(r.id)).map((r) => r.email);
        toast.success(`ส่งอีเมลไปยังผู้สมัครที่อนุมัติแล้วทั้งหมด ${emails.length} คน สำเร็จ`);
    }, [registrants]);

    const handleDelete = useCallback((registrantId: string) => {
        // TODO: Call API to delete registration
        toast.success("ลบผู้สมัครสำเร็จ");
        mutate();
    }, [mutate]);

    // Calculate stats
    const approvedCount = registrants.filter((r) => r.status === "approved").length;
    const pendingCount = registrants.filter((r) => r.status === "pending").length;
    const rejectedCount = registrants.filter((r) => r.status === "rejected").length;
    
    const totalCapacity = useMemo(() => {
        return data?.schedules.reduce((sum, s) => sum + s.max_users, 0) ?? 0;
    }, [data]);

    const totalRevenue = useMemo(() => {
        return registrants
            .filter((r) => r.status === "approved")
            .reduce((sum, r) => sum + (r.amount ?? 0), 0);
    }, [registrants]);

    return (
        <div className="sm:p-6">
            <div className="text-xl pb-6">{data?.title ?? id}</div>
            <ActivityStats
                stats={[
                    { label: "รายได้", value: `${totalRevenue.toLocaleString()} ฿`, change: "" },
                    {
                        label: "จำนวนผู้สมัคร",
                        value: `${registrants.length} / ${totalCapacity}`,
                        change: `อนุมัติ: ${approvedCount}`,
                    },
                    {
                        label: "สถานะ",
                        value: `รอ: ${pendingCount}`,
                        change: `ปฏิเสธ: ${rejectedCount}`,
                        changeColor: rejectedCount > 0 ? "text-red-600" : "text-blue-600",
                    },
                ]}
            />

            <div className="mt-8">
                <h2 className="text-lg font-semibold mb-4">รายชื่อผู้สมัคร</h2>
                <MemberRegistrationTable
                    registrants={registrants}
                    isLoading={isLoading}
                    onConfirm={handleConfirm}
                    onReject={handleReject}
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

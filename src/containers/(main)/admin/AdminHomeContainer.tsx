"use client";
import { AdminActivityCard } from "@/components/(main)/activity/AdminActivityCard";
import { AdminActivityTable } from "@/components/(main)/admin/AdminActivityTable";
import { api } from "@/services";
import { ActivityStats } from "@/components/(main)/profile/ActivityStats";
import { toast } from "sonner";
import useSWR from "swr";

export const AdminHomeContainer = () => {
    const {
        data: activities = [],
        isLoading: isLoadingUnpublished,
        mutate: mutateUnpublished,
    } = useSWR("admin/unpublished", () => api.activityService.getUnpublishedActivities(), {
        onError: (error) => {
            toast.error(error instanceof Error ? error.message : "เกิดข้อผิดพลาดในการโหลดกิจกรรม");
        },
    });

    const {
        data: activitiesPB = [],
        isLoading: isLoadingAll,
        mutate: mutateAll,
    } = useSWR("admin/all-activities", () => api.activityService.getAllActivities(), {
        onError: (error) => {
            toast.error(error instanceof Error ? error.message : "เกิดข้อผิดพลาดในการโหลดกิจกรรม");
        },
    });

    const isLoading = isLoadingUnpublished || isLoadingAll;

    const handleApproveSuccess = () => {
        mutateUnpublished();
        mutateAll();
    };

    return (
        <div className="h-full w-full overflow-auto sm:p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-3xl font-bold">จัดการกิจกรรม</h3>
                <div className="text-sm text-gray-600">{activities.length} กิจกรรมรออนุมัติ</div>
            </div>

            <ActivityStats stats={[
                { label: "กิจกรรมที่เปิดตอนนี้", value: activitiesPB.length, change: "" },
                { label: "กิจกรรมรออนุมัติ", value: activities.length, change: "" },
                { label: "จำนวนผู้ใช้", value: 12, change: "", changeColor: "text-blue-600" },
                { label: "รายได้ทั้งหมด", value: 12, change: "", changeColor: "text-blue-600" },
            ]} />

            <div className=" text-xl pt-6 py-4 font-bold">
                รายการรออนุมัติ
            </div>

            {isLoading ? (
                <div className="mt-8 flex justify-center items-center">
                    <div className="text-gray-500">กำลังโหลดกิจกรรม...</div>
                </div>
            ) : activities.length === 0 ? (
                <div className="mt-8 flex justify-center items-center">
                    <div className="text-gray-500">ไม่มีกิจกรรมรออนุมัติ</div>
                </div>
            ) : (
                <div className="grid grid-cols-1 min-[540px]:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                    {activities.map((activity) => (
                        <AdminActivityCard
                            key={activity.id}
                            activity={activity}
                            onApproveSuccess={handleApproveSuccess}
                        />
                    ))}
                </div>
            )}

            <div className="text-xl pt-8 py-4 font-bold">
                กิจกรรมทั้งหมด
            </div>

            <AdminActivityTable activities={activitiesPB} isLoading={isLoading} />
        </div>
    );
};

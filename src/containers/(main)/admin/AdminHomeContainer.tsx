"use client";
import { useState, useEffect } from "react";
import { AdminActivityCard } from "@/components/(main)/activity/AdminActivityCard";
import { api } from "@/services";
import type { Activity } from "@/services/api/ActivityService";
import { toast } from "sonner";

export const AdminHomeContainer = () => {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchUnpublishedActivities = async () => {
        try {
            setIsLoading(true);
            const data = await api.activityService.getUnpublishedActivities();
            setActivities(data);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "เกิดข้อผิดพลาดในการโหลดกิจกรรม");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUnpublishedActivities();
    }, []);

    const handleApproveSuccess = () => {
        fetchUnpublishedActivities();
    };

    return (
        <div className="h-full w-full overflow-auto">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-3xl">จัดการกิจกรรม</h3>
                <div className="text-sm text-gray-600">{activities.length} กิจกรรมรออนุมัติ</div>
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
        </div>
    );
};

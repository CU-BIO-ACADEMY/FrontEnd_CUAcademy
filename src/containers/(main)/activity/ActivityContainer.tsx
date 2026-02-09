"use client";
import { Button } from "@heroui/react";
import { ActivityCard } from "@/components/(main)/activity/ActCard";
import { CreateActivityModal } from "./CreateActivityModal";
import { useState, useEffect } from "react";
import { api } from "@/services";
import type { Activity } from "@/services/api/ActivityService";
import { toast } from "sonner";

export default function ActivityContainer() {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [activities, setActivities] = useState<Activity[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchActivities = async () => {
        try {
            setIsLoading(true);
            const data = await api.activityService.getAllActivities();
            setActivities(data);
        } catch (error: unknown) {
            toast.error(error instanceof Error ? error.message : "เกิดข้อผิดพลาดในการโหลดกิจกรรม")
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchActivities();
    }, []);

    const handleCreateSuccess = () => {
        fetchActivities();
    };

    return (
        <div className={`h-full w-full overflow-auto relative`}>
            <div className={`flex justify-between`}>
                <h3 className="text-3xl">กิจกรรม</h3>
                <div className={`flex gap-2`}>
                    <Button
                        className={`text-white bg-(--pink2) ring-2 ring-(--pink1)`}
                        variant={`shadow`}
                        onPress={() => setIsCreateModalOpen(true)}
                    >
                        เพิ่มกิจกรรม
                    </Button>
                    <Button isIconOnly className={`text-white`} variant={`faded`}>
                        <i className="fa-solid fa-filter text-(--pink2)"></i>
                    </Button>
                </div>
            </div>

            {isLoading ? (
                <div className="mt-8 flex justify-center items-center">
                    <div className="text-gray-500">กำลังโหลดกิจกรรม...</div>
                </div>
            ) : activities.length === 0 ? (
                <div className="mt-8 flex justify-center items-center">
                    <div className="text-gray-500">ยังไม่มีกิจกรรม</div>
                </div>
            ) : (
                <div
                    className={` mt-8 grid grid-cols-1 min-[540px]:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4  px-2`}
                >
                    {activities.map((activity) => (
                        <ActivityCard
                            key={activity.id}
                            activity={activity}
                            currentParticipants={0}
                        />
                    ))}
                </div>
            )}

            <CreateActivityModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={handleCreateSuccess}
            />
        </div>
    );
}

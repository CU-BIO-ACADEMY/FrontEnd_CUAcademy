'use client'
import { Card, CardHeader, CardBody, CardFooter, Image, Button } from "@heroui/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import "dayjs/locale/th";
import type { Activity } from "@/services/api/ActivityService";
import { api } from "@/services";
import { toast } from "sonner";

dayjs.locale("th");

interface AdminActivityCardProps {
    activity: Activity;
    onApproveSuccess: () => void;
}

export function AdminActivityCard({ activity, onApproveSuccess }: AdminActivityCardProps) {
    const [isApproving, setIsApproving] = useState(false);
    const router = useRouter();
    const eventDate = dayjs(activity.event_start_at).format('DD/MM/YYYY');

    const handleApprove = async () => {
        try {
            setIsApproving(true);
            await api.activityService.approveActivity(activity.id);
            toast.success("อนุมัติกิจกรรมสำเร็จ");
            onApproveSuccess();
        } catch (error: any) {
            toast.error(error.message || "เกิดข้อผิดพลาดในการอนุมัติกิจกรรม");
        } finally {
            setIsApproving(false);
        }
    };

    return (
        <Card radius="sm" className="h-full">
            <CardHeader className="h-[140px] overflow-hidden px-0 py-0">
                <Image
                    src={activity.thumbnail_url}
                    alt={activity.title}
                    width="300"
                    height="200"
                    radius="none"
                    className="object-cover w-full h-full"
                />
            </CardHeader>
            <CardBody className="flex flex-col justify-between gap-3">
                <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">{activity.title}</span>
                    <span className="text-xs text-gray-600">{eventDate}</span>
                </div>
                <div className="text-sm text-gray-500 line-clamp-2">
                    {activity.description_short}
                </div>
                <div className="text-sm text-gray-600 flex items-center justify-between">
                    <span>ผู้เข้าร่วม: {activity.max_users} คน</span>
                    <span>ค่าสมัคร: {activity.price} ฿</span>
                </div>
            </CardBody>
            <CardFooter className="flex gap-2">
                <Button
                    fullWidth
                    variant="shadow"
                    className="bg-(--pink2) text-white shadow-red-200"
                    onPress={handleApprove}
                    isLoading={isApproving}
                    isDisabled={isApproving}
                >
                    {isApproving ? "กำลังอนุมัติ..." : "อนุมัติ"}
                </Button>
                <Button
                    fullWidth
                    variant="faded"
                    onPress={() => router.push(`/activity/${activity.id}`)}
                    className="text-(--pink2)"
                    isDisabled={isApproving}
                >
                    ดูรายละเอียด
                </Button>
            </CardFooter>
        </Card>
    );
}

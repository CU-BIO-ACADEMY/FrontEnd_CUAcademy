"use client";
import { Card, CardHeader, CardBody, CardFooter, Image } from "@heroui/react";
import { Chip } from "@heroui/chip";
import { Progress } from "@heroui/progress";
import { Divider } from "@heroui/divider";
import { Button } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useDisclosure } from "@heroui/react";
import dayjs from "dayjs";
import "dayjs/locale/th";
import type { Activity } from "@/services/api/ActivityService";
import { ActivityRegistrationModal } from "./ActivityRegistrationModal";

dayjs.locale("th");

interface ActivityCardInterFace {
    activity: Activity;
    currentParticipants?: number;
    onRegisterSuccess?: () => void;
}

export function ActivityCard({ activity, currentParticipants = 0, onRegisterSuccess }: ActivityCardInterFace) {
    // ใช้ข้อมูลจาก schedule แรก หรือคำนวณจากทุก schedules
    const firstSchedule = activity.schedules[0];
    const regisMax = () => {
        let hh = 0
        activity.schedules.map((item) => hh += item.max_users)
        return hh
    }
    const maxUsers = regisMax();
    const eventStartAt = firstSchedule?.event_start_at ?? activity.next_event_start_at ?? activity.registration_open_at;
    const price = activity.price ?? firstSchedule?.price ?? 0;

    const value = maxUsers > 0 ? (currentParticipants / maxUsers) * 100 : 0;
    const router = useRouter();
    const { isOpen: isModalOpen, onOpen: onModalOpen, onClose: onModalClose } = useDisclosure();

    const isNew = dayjs().diff(dayjs(activity.registration_open_at), "day") < 3;
    const isFull = maxUsers > 0 && currentParticipants >= maxUsers;
    const eventDate = dayjs(eventStartAt).format("DD/MM/YYYY");

    return (
        <div key={activity.id} className={`relative`}>
            <Card radius={`sm`} className={` h-full `}>
                <CardHeader className={`h-[140px] overflow-hidden px-0 py-0`}>
                    <Image
                        src={activity.thumbnail_url}
                        alt={activity.title}
                        width={`300`}
                        height={`200`}
                        radius="none"
                        className={` object-cover w-full h-full aspect-3/2`}
                    />
                </CardHeader>
                <CardBody className={`flex flex-col justify-between`}>
                    <div className={`flex justify-between items-center`}>
                        <span className={`text-lg`}>{activity.title}</span>
                        <span className={`text-xs text-gray-600`}>{eventDate}</span>
                    </div>
                    <div className={`text-sm text-gray-500 line-clamp-2 my-2`}>
                        {activity.description_short}
                    </div>
                    <div className={`mt-4 flex flex-col gap-2`}>
                        <div className={`flex flex-col gap-1`}>
                            <div className={`text-gray-500 text-sm flex justify-between`}>
                                <span>ผู้สมัคร</span>
                                <span>
                                    {currentParticipants}/{maxUsers}
                                </span>
                            </div>
                            <Progress
                                classNames={{ indicator: "bg-[var(--pink2)]" }}
                                value={value}
                            />
                        </div>
                        <div
                            className={` text-center text-sm text-gray-700 flex items-center justify-center gap-1 relative`}
                        >
                            <span className="underline">ค่าสมัคร : {price} ฿</span>
                            <i className="fa-duotone fa-solid fa-credit-card absolute right-1"></i>
                        </div>
                    </div>
                </CardBody>
                <Divider />
                <CardFooter className={`flex gap-2`}>
                    <Button
                        fullWidth
                        variant="shadow"
                        onPress={() => router.push(`/activity/${activity.id}`)}
                        className={`bg-(--pink2) text-white shadow-red-200`}
                    >
                        ข้อมูลเพิ่มเติม
                    </Button>
                </CardFooter>
            </Card>
            {isNew && (
                <Chip
                    size={`sm`}
                    color="danger"
                    variant="shadow"
                    className={` absolute -top-2 sm:-right-2 z-10`}
                >
                    NEW
                </Chip>
            )}

            <ActivityRegistrationModal
                isOpen={isModalOpen}
                onClose={onModalClose}
                activityId={activity.id}
                activityTitle={activity.title}
                activityPrice={price}
                onSuccess={onRegisterSuccess}
            />
        </div>
    );
}

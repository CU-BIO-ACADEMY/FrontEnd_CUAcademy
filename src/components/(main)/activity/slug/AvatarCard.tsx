import React from 'react'
import { Card, CardBody, CardFooter, useDisclosure, Button, Avatar } from '@heroui/react'
import { Progress } from '@heroui/progress'
import { ActivityRegistrationModal } from '@/components/(main)/activity/ActivityRegistrationModal';
import { ShareModal } from '@/components/(main)/activity/ShareModal';
import type { ActivityScheduleDetail } from "@/services/api/ActivityService"
import dayjs from "dayjs";
import "dayjs/locale/th"

dayjs.locale("th");

interface AvatarCardProps{
    id: string,
    img: string,
    title: string,
    regisNow: number,
    regisMax: number,
    isFull: boolean,
    data: ActivityScheduleDetail[];
}

function AvatarCard({ id, img, title, regisNow, regisMax, isFull, data }: AvatarCardProps) {
    const { isOpen: isModalOpen, onOpen: onModalOpen, onClose: onModalClose } = useDisclosure();
    const { isOpen: isShareOpen, onOpen: onShareOpen, onClose: onShareClose } = useDisclosure();
    const percentage = regisMax > 0 ? (regisNow / regisMax) * 100 : 0;

    return (
        <>
            <Card className="w-full h-max border relative border-gray-100 bg-white overflow-hidden ">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-(--pink1) opacity-30 animate-blob" />
                    <div className="absolute -bottom-6 -left-6 w-20 h-20 rounded-full bg-(--pink2) opacity-20 animate-blob animation-delay-2000" />
                    <div className="absolute top-1/2 right-1/4 w-16 h-16 rounded-full bg-(--secondary) opacity-25 animate-blob animation-delay-4000" />
                </div>
                <CardBody className="relative flex items-center gap-4 py-6 px-5">
                    <div className="relative z-10 ring-3 ring-[var(--pink1)] ring-offset-2 rounded-full">
                        <Avatar
                            size="lg"
                            src={img}
                            className="w-16 h-16"
                        />
                    </div>
                    <h3 className="relative z-10 text-lg font-semibold text-gray-800 line-clamp-1 w-full text-center">
                        {title}
                    </h3>
                    {/*<div className="relative z-10 flex items-baseline justify-center gap-0.5">
                        <span className={`text-5xl font-bold tracking-tight ${isFull ? 'text-red-400' : 'text-[var(--pink2)]'}`}>
                            {regisNow}
                        </span>
                        <span className="text-xl font-semibold text-pink-300">
                            /{regisMax}
                        </span>
                    </div>*/}
                    {data.map((items,index) => (
                        <div key={index} className="relative z-10 w-full">
                            <Progress
                                size="md"
                                label={
                                    <div className='flex justify-between w-full'>
                                        <p>วันที่ {dayjs(items.event_start_at).format("D MMMM YYYY")}</p>
                                        <p>{items.users_registered}/{items.max_users}</p>
                                    </div>
                                }
                                value={percentage}
                                classNames={{
                                    track: "bg-pink-50",
                                    indicator: isFull
                                        ? "bg-red-400"
                                        : "bg-gradient-to-r from-[var(--pink1)] to-[var(--pink2)]",
                                    label: 'w-full'
                                }}
                            />
                            <p className="text-xs text-gray-400 text-center mt-1">
                                {(items.max_users - items.users_registered) === 0 ? "เต็มแล้ว" : `เหลืออีก ${items.max_users - items.users_registered} ที่`}
                            </p>
                        </div>
                    ))}
                </CardBody>

                <CardFooter className="px-5 pb-5 pt-0 gap-2">
                    <Button
                        fullWidth
                        variant="shadow"
                        className="bg-gradient-to-r from-[var(--pink2)] to-pink-400 text-white font-medium shadow-pink-200/50 disabled:opacity-60"
                        onPress={onModalOpen}
                        isDisabled={isFull}
                    >
                        {isFull ? "เต็มแล้ว" : "สมัครเลย"}
                    </Button>
                    <Button
                        fullWidth
                        variant="faded"
                        onPress={onShareOpen}
                        isIconOnly
                        color='success'
                    >
                        <i className="fa-solid fa-share"></i>
                    </Button>
                </CardFooter>
            </Card>

            <ActivityRegistrationModal
                isOpen={isModalOpen}
                onClose={onModalClose}
                activityId={id}
                activityTitle=""
                activityPrice={0}
            />

            <ShareModal
                isOpen={isShareOpen}
                onClose={onShareClose}
                activityTitle={title}
                activityId={id}
            />
        </>
    )
}

export default AvatarCard

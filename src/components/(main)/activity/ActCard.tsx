'use client'
import { Card, CardHeader, CardBody, CardFooter, Image } from "@heroui/react";
import { Chip } from "@heroui/chip";
import { Progress } from "@heroui/progress";
import {Divider} from "@heroui/divider";
import { Button } from "@heroui/react"
import { useRouter } from "next/navigation"

interface ActivityCardInterFace{
    id:string;
    title:string;
    date:string;
    image?:string;
    desc:string;
    amount:number;
    maxCapacity:number;
    isNew?:boolean;
}

export function ActivityCard({id, title, image, date, desc, amount, maxCapacity, isNew}:ActivityCardInterFace){
    const value = (amount/maxCapacity)*100
    const router = useRouter()
    return(
        <div key={id} className={`relative`}>
            <Card radius={`sm`} className={` h-full`}>
                <CardHeader className={`h-[140px] overflow-hidden px-0 py-0`}>
                    <Image src={image} alt="card" width={`300`} height={`200`} radius="none" className={` object-cover w-full h-full`}/>
                </CardHeader>
                <CardBody className={`flex flex-col justify-between`}>
                    <div className={`flex justify-between items-center`}>
                        <span className={`text-lg`}>{title}</span>
                        <span className={`text-xs text-gray-600`}>{date}</span>
                    </div>
                    <div className={`text-sm text-gray-500 line-clamp-2 my-2`}>{desc}</div>
                    <div className={`mt-4 flex flex-col gap-2`}>
                        <div className={`flex flex-col gap-1`}>
                            <div className={`text-gray-500 text-sm flex justify-between`}>
                                <span>ผู้สมัคร</span>
                                <span>{amount}/{maxCapacity}</span>
                            </div>
                            <Progress classNames={{indicator:'bg-[var(--pink2)]'}} value={value} />
                        </div>
                        <div className={` text-center text-sm text-gray-700 flex items-center justify-center gap-1 relative`}>
                            <span className="underline">ค่าสมัคร : 200 </span>
                            <i className="fa-duotone fa-solid fa-credit-card absolute right-1"></i>
                        </div>
                    </div>
                </CardBody>
                <Divider />
                <CardFooter className={`flex gap-2`}>
                    <Button fullWidth variant="shadow" className={` bg-(--pink2) text-white shadow-red-200`}>สมัคร</Button>
                    <Button fullWidth variant="faded" onPress={() => router.push(`/activity/${id}`)} className={`text-(--pink2)`}>ข้อมูลเพิ่มเติม</Button>
                </CardFooter>
            </Card>
            {isNew && (
                <Chip size={`sm`} color="danger" variant="shadow" className={` absolute -top-2 sm:-right-2 z-10`}>NEW</Chip>
            )}
        </div>
    )
}

"use client"
import { Button } from "@heroui/react"
import { ActivityCard } from "@/components/(main)/activity/ActCard"

export default function ActivityContainer() {
    return (
        <div className={`h-full w-full overflow-auto relative`}>
            <div className={`flex justify-between`}>
                <h3 className="text-3xl">กิจกรรม</h3>
                <div className={`flex gap-2`}>
                    <Button className={`text-white bg-(--pink2) ring-2 ring-(--pink1)`} variant={`shadow`}>เพิ่มกิจกรรม</Button>
                    <Button isIconOnly className={`text-white`} variant={`faded`}><i className="fa-solid fa-filter text-(--pink2)"></i></Button>
                </div>
            </div>
            <div className={` mt-8 grid grid-cols-1 min-[540px]:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 `}>
                <ActivityCard
                    id={`fesgdr3245`}
                    title={`ผ่ากบกันจ้าา`}
                    date={`20/12/2569`}
                    image={`/card/test2.jpg`}
                    isNew={true}
                    desc={`dwawfwd`}
                    amount={20}
                    maxCapacity={120}
                />
            </div>
        </div>
    );
}

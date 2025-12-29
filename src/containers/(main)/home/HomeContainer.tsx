'use client'
import React from 'react'
import { BannerSlide } from '@/components/(main)/main/BannerSlide'
import { Card, CardBody, CardHeader } from "@heroui/react"

function HomeContainer() {
    const Images = ['https://i.pinimg.com/736x/4c/3c/ec/4c3cec74b7f464570db2fb130e9bb450.jpg','https://i.pinimg.com/originals/4c/de/db/4cdedb6e453e7e5a7fec5748315ff3ca.gif','https://i.pinimg.com/originals/af/28/44/af2844e97bf4a88403c13cdd22ddea1e.gif']
    return (
        <div className='flex flex-col gap-2'>
            <BannerSlide images={Images}/>
            {/* <div>
                แจ้งเตือน
            </div> */}
            <Card className=' w-full sm:w-80 ring ring-(--pink1) h-60 divide-y-2 divide-(--secondary)'>
                <CardHeader className='flex justify-center items-center shrink-0 gap-2 *:text-(--pink2)'>
                    <i className="fa-solid fa-megaphone -rotate-30"></i>
                    <span className='text-xl'>แจ้งเตือน</span>
                </CardHeader>
                <CardBody className='flex flex-col gap-2 overflow-auto flex-1'>
                    <Card className='h-16 bg-(--secondary) shrink-0'>
                        <CardBody>
                            Nano
                        </CardBody>
                    </Card>
                    <Card className='h-16 bg-(--secondary) shrink-0'>
                        <CardBody>
                            Nano
                        </CardBody>
                    </Card>
                    <Card className='h-16 bg-(--secondary) shrink-0'>
                        <CardBody>
                            Nano
                        </CardBody>
                    </Card>
                    <Card className='h-16 bg-(--secondary) shrink-0'>
                        <CardBody>
                            Nano
                        </CardBody>
                    </Card>
                </CardBody>
            </Card>
        </div>
    )
}

export default HomeContainer
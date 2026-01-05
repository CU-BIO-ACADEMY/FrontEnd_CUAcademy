'use client'
import { Card, CardBody, Avatar, Button, Chip } from "@heroui/react"

interface ProfileCardProps{
    image?: string;
    email: string;
    fullName: string;
    tag?: String[];
    resetPass?: () => void;
    editData?: () => void;
}

export function ProfileCard({ image, email, fullName, tag }: ProfileCardProps){
    return(
        <Card radius='sm' className='w-full items-center ring ring-(--pink2) shadow-lg shadow-pink-200'>
            <CardBody className=' items-center gap-4'>
                <div className='flex flex-col gap-1 items-center'>
                    {image ? (
                        <Avatar size='lg' src={image} />
                    ):(
                        <Avatar size='lg'  />
                    )}
                    <div className='flex items-center flex-col'>
                        <p className=' text-lg'>{fullName}</p>
                        <p className=' text-xs text-gray-400'>{email}</p>
                    </div>
                </div>
                {tag && (
                    <div className='flex flex-col gap-2 w-3/4 justify-center items-center'>
                        <span className="text-sm text-gray-600">interest:</span>
                        <div className="w-full flex flex-wrap whitespace-break-spaces gap-2 justify-center">
                            {tag.map((item, index) => (
                                <Chip className=" bg-(--pink1)" size="sm" key={index}>{item}</Chip>
                            ))}
                        </div>
                    </div>
                )}
                <div className='w-full flex gap-2'>
                    <Button radius='sm' className='flex-1'>แก้ไขรหัสผ่าน</Button>
                    <Button radius='sm' variant='shadow' color='warning' className='flex-1'>แก้ไขข้อมูล</Button>
                </div>
            </CardBody>
        </Card>
    )
}
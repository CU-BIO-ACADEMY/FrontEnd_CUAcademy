"use client"
import React, { useState } from "react"
import { motion } from "motion/react"
import Image from "next/image"
import { Button } from "@heroui/react"
import Link from "next/link"
import {Avatar, AvatarIcon} from "@heroui/react";
import { Navlinks } from '@/variable/navigate'
import { Fade as Hamburger } from 'hamburger-react'
import { useRouter } from 'next/navigation'
import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem} from "@heroui/react";
import { useAuth } from "@/hooks/useAuth"

const Navbar = () => {
    const { user } = useAuth()
    const [login, setLogin] = useState(true)
    const [openDropdown, setOpenDropdown] = useState<number | null>(null)
    const [openHam, setOpenHam] = useState(false)
    const router = useRouter()

    return(
        <div className={` min-h-18 flex items-center border-b-2 border-gray-100 relative`}>
            <motion.div
                initial={{ y:-20, opacity:0 }}
                transition={{duration: 1.2, ease:"easeOut"}}
                whileInView={{ y:0,opacity:1 }}
                className={` flex w-full h-18 z-100 items-center px-4 md:px-8 justify-between`}
            >
                <div className={` md:w-40 w-30 h-full flex items-center`}>
                    <Image onClick={() => router.push('/home')} src={`/logo/logo2.png`} alt={`logo`} width={`256`} height={'128'} className={`object-contain cursor-pointer`} />
                </div>
                <div className={` md:flex hidden md:gap-8 lg:gap-16 text-sm`}>
                    {Navlinks.filter((item, index) => index < 4).map((item,index) => (
                        item.dropdown.length > 0 ? (
                            <div key={index}>
                                <Dropdown offset={15} onOpenChange={(isOpen) => setOpenDropdown(isOpen ? index : null)}>
                                    <DropdownTrigger>
                                        <p className="cursor-pointer text-gray-600 hover:text-black transition-all">
                                            {item.title}
                                            <i className={`fa-light fa-angle-down transition-transform ${openDropdown === index ? "rotate-180" : ""}`}></i>
                                        </p>
                                    </DropdownTrigger>
                                    <DropdownMenu variant="shadow" aria-label="Static Actions">
                                        {item.dropdown.map((dropItem, dropIndex) => (
                                            <DropdownItem
                                                onClick={() => router.push(dropItem.link)}
                                                key={dropIndex}
                                            >
                                                {dropItem.title}
                                            </DropdownItem>
                                        ))}
                                    </DropdownMenu>
                                </Dropdown>
                            </div>
                        ):(
                            <Link className={`text-gray-600 hover:text-black transition-all`} key={index} href={item.link}>{item.title}</Link>
                        )
                    ))}
                </div>
                <div className={`flex md:gap-4 items-center`}>
                    { user ? (
                        <>
                            {/*<Button size="sm" radius="sm" className={`border-2 border-(--pink2) bg-(--pink1) text-gray-600 flex items-center gap-1`}>
                                <i className="fa-duotone fa-solid fa-credit-card"></i>{user.balance}
                            </Button>*/}
                            <Avatar src="" alt={`avatar`} isBordered size="sm" onClick={() => router.push("/profile")}
                                classNames={{
                                    base: "bg-linear-to-br from-[var(--pink1)] to-[var(--pink2)]",
                                    icon: "text-black/80",
                                }}
                                icon={<AvatarIcon />}
                                className={` ring-(--pink2) cursor-pointer hidden md:flex`}
                            />
                            <div className={`flex md:hidden`}>
                                <Hamburger size={24} rounded toggled={openHam} toggle={setOpenHam} />
                            </div>
                        </>
                    ):(
                        <>
                            <Button size="md" radius="sm" className={`border-2 border-(--pink2) bg-(--pink1)`}>เข้าสู่ระบบ</Button>
                        </>
                    ) }
                </div>
            </motion.div>
            <div className={` ${openHam ? 'translate-y-0':'-translate-y-260'} origin-top absolute transition-all z-26 overflow-hidden duration-1000 w-full bg-pink-100 top-16 h-[calc(100dvh-4rem)]`}>
                <div className={`${openHam ? 'opacity-100':'opacity-0'} transition-all delay-800 w-full px-10 py-10 flex flex-col gap-6 *:text-2xl`}>
                    {Navlinks.filter(item => item.disable === false).map((item,index) => (
                        item.dropdown.length > 0 ? (
                            <div key={index}>
                                <p onClick={() => setOpenDropdown(openDropdown === index ? null : index)} className="cursor-pointer text-gray-600 hover:text-black transition-all select-none">
                                    {item.title}
                                    <i className={`fa-light fa-angle-down transition-transform ${openDropdown === index ? "rotate-180" : ""}`}></i>
                                </p>
                                <div className={`${openDropdown === index ? `opacity-100 pt-4 h-${(index+1)*12}` : "opacity-0 h-0 overflow-hidden"} transition-all duration-500 pl-6 gap-4 flex flex-col`}>
                                    {item.dropdown.map((dropItem, dropIndex) => (
                                        <p
                                            onClick={() => {
                                                router.push(dropItem.link);
                                                setOpenHam(false)
                                                setOpenDropdown(null)
                                            }}
                                            key={dropIndex}
                                            className={`text-xl text-gray-600 cursor-pointer`}
                                        >
                                            {dropItem.title}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        ):(
                            <Link className={`text-gray-600 hover:text-black transition-all`} onClick={() => setOpenHam(false)} key={index} href={item.link}>{item.title}</Link>
                        )
                    ))}
                </div>
            </div>
            <div className={` ${openHam ? 'translate-y-0':'-translate-y-260'} origin-top absolute transition-all z-24 duration-800 overflow-hidden w-full bg-(--pink1) top-16 h-[calc(100dvh-4rem)]`}></div>
            <div className={` ${openHam ? 'translate-y-0':'-translate-y-260'} origin-top absolute transition-all z-20 duration-300 overflow-hidden w-full bg-(--pink2) top-16 h-[calc(100dvh-4rem)]`}></div>
        </div>
    )
}

export default Navbar

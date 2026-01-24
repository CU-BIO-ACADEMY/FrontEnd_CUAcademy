"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Sidelinks } from "@/variable/navigate";
import { useRouter, usePathname } from "next/navigation";
import { Button, Divider } from "@heroui/react";
import { useAuth } from "@/hooks/useAuth";

const Sidebar = () => {
    const { logout, user } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [activeIndex, setActiveIndex] = useState(0);

    const visibleLinks = Sidelinks.filter((link) => {
        if (link.link === "/admin") {
            return user?.role === "admin";
        }
        return true;
    });

    useEffect(() => {
        const index = visibleLinks.findIndex((item) => item.link.includes(pathname));
        if (index !== -1) {
            setActiveIndex(index);
        }
    }, [pathname, visibleLinks]);

    const IsPath = (link: string) => {
        return pathname === link;
    };

    return (
        <div className={` min-w-54 max-w-54 h-full flex items-center bg-gray-100`}>
            <motion.div
                initial={{ x: -60, opacity: 0 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                whileInView={{ x: 0, opacity: 1 }}
                className={` flex flex-col w-full h-full items-center justify-between py-2`}
            >
                <div className={`w-full flex flex-col gap-2 px-4 relative`}>
                    {visibleLinks.map((item, index) => (
                        <Button
                            onPress={() => {
                                router.push(item.link);
                                setActiveIndex(index);
                            }}
                            variant="light"
                            isDisabled={item.disable}
                            key={index}
                            className={`w-full z-10 h-12 px-2 gap-2 cursor-pointer flex items-center justify-start rounded-md`}
                        >
                            <i
                                className={`fa-regular text-xl transition-all ${item.icon} ${IsPath(item.link) ? "text-black" : "text-[#57595b]"} `}
                            ></i>
                            <span
                                className={`text-sm transition-all ${IsPath(item.link) ? "text-black" : "text-[#57595b]"}`}
                            >
                                {item.title}
                            </span>
                        </Button>
                    ))}
                    <div
                        className={` absolute top-0 w-[calc(100%-2rem)] duration-600 h-12 bg-(--pink1) rounded-md transition-all`}
                        style={{
                            transform: `translateY(${activeIndex * (48 + 8)}px)`,
                        }}
                    ></div>
                </div>
                <div className={`w-full px-4`}>
                    <Divider className="my-4" />
                    <Button color="danger" variant="shadow" fullWidth onPress={logout}>
                        ออกจากระบบ
                    </Button>
                </div>
            </motion.div>
        </div>
    );
};
export default Sidebar;

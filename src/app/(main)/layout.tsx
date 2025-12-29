import {ReactNode} from "react"
import Navbar from "@/containers/navbars/Navbar"
import SideBar from "@/containers/Sidebar"

export default function MainLayout({children}:{children:ReactNode}){
    return(
        <>
            <div className={`flex w-screen h-screen overflow-hidden flex-col`}>
                <Navbar />
                <div className={` grow overflow-hidden flex`}>
                    <div className={` hidden lg:flex`}>
                        <SideBar />
                    </div>
                    <div className={`grow overflow-auto p-4`}>
                        {children}
                    </div>
                </div>
            </div>
        </>
    )
}

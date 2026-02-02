import { ReactNode } from "react";
import Navbar from "@/containers/navbars/Navbar";
import SideBar from "@/containers/Sidebar";
import { AuthGuard } from "@/components/AuthGuard";

export default function MainLayout({ children }: { children: ReactNode }) {
    return (
        <AuthGuard>
            <div className={`flex w-screen h-screen overflow-hidden flex-col`}>
                <Navbar />
                <div className={` grow overflow-hidden flex`}>
                    <div className={` hidden lg:flex`}>
                        <SideBar />
                    </div>
                    <div className={`grow overflow-auto p-4 bg-gradient-to-br from-pink-50 via-white to-pink-100`}>
                        <div className="absolute inset-0 overflow-hidden">
                            <div className="absolute -top-40 -right-40 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
                            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-white rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob animation-delay-4000"></div>
                        </div>
                        {children}
                    </div>
                </div>
            </div>
        </AuthGuard>
    );
}

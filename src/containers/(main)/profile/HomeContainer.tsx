"use client";

import { ProfileCard } from "@/components/(main)/profile/profileCard";
import { useAuth } from "@/hooks/useAuth";
import { Role } from "@/types/user";

function ProfileContainer() {
    const { user } = useAuth();

    return (
        <div className="flex flex-col">
            <div className="flex gap-2">
                <div className="w-60">
                    <ProfileCard
                        email={user?.email || ""}
                        fullName={user?.display_name || ""}
                        tag={["Nano", "fffff", "awdv"]}
                        role={user?.role || Role.MEMBER}
                    />
                </div>
                <div className="flex grow bg-red-400 ">
                    <div></div>
                    <div></div>
                </div>
            </div>
            <div>awdwaf</div>
        </div>
    );
}

export default ProfileContainer;


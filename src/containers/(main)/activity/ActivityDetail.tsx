"use client";

import { Image, useDisclosure } from "@heroui/react";
import { ActivityRegistrationModal } from "@/components/(main)/activity/ActivityRegistrationModal";
import AvatarCard from "@/components/(main)/activity/slug/AvatarCard";
import BodyCard from "@/components/(main)/activity/slug/BodyCard";
import type { ActivityFile } from "@/components/(main)/activity/slug/BodyCard";
import { api } from "@/services";
import useSWR from "swr";

interface ActivityDetailProps {
    id: string;
}

export const ActivityDetail = ({ id }: ActivityDetailProps) => {
    const { data, error, isLoading } = useSWR(`/api/activities/${id}`, () =>
        api.activityService.getActivityById(id)
    );

    const { isOpen: isModalOpen, onOpen: onModalOpen, onClose: onModalClose } = useDisclosure();

    if (!data) return <div>กำลังโหลด</div>;

    const isFull = false;
    const mockDiscText =
        "Illum illum praesent dolor euismod feugiat magna erat amet zzril lorem et amet justo consequat at no voluptua aliquyam eos ullamcorper gubergren eum qui feugait accusam vero sanctus justo sit duis et lobortis duis nonumy sed amet aliquyam ut sadipscing et consetetur sed soluta aliquyam et amet labore dolore dolor at lorem accumsan amet dolore magna sed stet dolor suscipit facilisi et lorem ipsum lorem ut consetetur ea et eos commodo labore euismod invidunt voluptua aliquyam justo diam lorem amet lorem nonumy vero ut et clita dolor augue dolore consequat aliquam adipiscing nibh rebum justo aliquyam nonummy eirmod option lobortis nonumy ut molestie sadipscing et in elitr molestie duo dolor dignissim ut consequat diam praesent blandit amet consequat dolore elitr aliquam nulla consequat dolor invidunt dolores nibh clita vel aliquyam ut magna gubergren consetetur voluptua duo invidunt zzril consetetur rebum assum sadipscing dolore erat at accusam lorem amet illum commodo euismod aliquyam takimata takimata magna sadipscing accusam diam eos est labore aliquyam invidunt eirmod dolores accumsan vero assum accusam ipsum ex invidunt tation amet odio no justo nisl justo sed duo diam aliquyam labore invidunt sanctus takimata dolor stet stet et sit nonummy iusto aliquyam facilisi vero lobortis clita nonumy";

    const mockFiles: ActivityFile[] = [
        { name: "กำหนดการกิจกรรม.pdf", url: "#", size: "2.4 MB" },
        { name: "แบบฟอร์มสมัคร.docx", url: "#", size: "156 KB" },
        { name: "แผนที่สถานที่จัดงาน.png", url: "#", size: "1.1 MB" },
    ];

    const files = data.attachments.map(
        (att): ActivityFile => ({
            name: att.filename,
            url: att.url,
            size: `${(att.size / 1024).toFixed(2)} KB`,
        })
    );

    return (
        <>
            <div className="flex flex-col gap-2">
                <Image
                    src={data.thumbnail}
                    alt="banner"
                    classNames={{ wrapper: "max-w-none!" }}
                    className="w-full aspect-4/1 md:aspect-6/1 object-cover"
                />
                <div className="flex md:flex-row flex-col gap-3">
                    <div className="flex-1">
                        <AvatarCard
                            id={id}
                            img={data.thumbnail}
                            regisNow={data.users_registered}
                            regisMax={data.max_users}
                            title={data.title}
                            isFull={isFull}
                        />
                    </div>
                    <BodyCard disc={data.description} files={files} />
                </div>
            </div>
            <ActivityRegistrationModal
                isOpen={isModalOpen}
                onClose={onModalClose}
                activityId={id}
                activityTitle=""
                activityPrice={0}
            />
        </>
    );
};

import { ActivityDetail } from "@/containers/(main)/activity/ActivityDetail";

export default async function ActivityIdPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    return <ActivityDetail id={id} />;
}

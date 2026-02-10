import AdminActivityDetail from "@/containers/(main)/admin/AdminActivityDetail";

export default async function ActivityIdPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    return <AdminActivityDetail id={id} />;
}

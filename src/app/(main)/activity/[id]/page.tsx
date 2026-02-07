import SlugContainer from "@/containers/(main)/activity/SlugContainer"

export default async function ActivityIdPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    return (
        <SlugContainer id={id} />
    )
}

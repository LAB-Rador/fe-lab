import MagicLinkContainer from "./magic.container"

interface MagicLinkPageProps {
    searchParams: Promise<{ token?: string }>
}

export default async function Page({ searchParams }: MagicLinkPageProps) {
    const { token } = await searchParams
    return <MagicLinkContainer token={token ?? ""} />
}

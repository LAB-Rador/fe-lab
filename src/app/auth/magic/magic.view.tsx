import { Button } from "@/src/components/ui/button"
import Link from "next/link"

interface MagicLinkViewProps {
    error?: string
}

export default function MagicLinkView({ error }: MagicLinkViewProps) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md space-y-4 rounded-lg bg-white p-8 shadow-md text-center">
                <h1 className="text-2xl font-bold text-gray-900">
                    {error ? "Sign-in link" : "Signing you in"}
                </h1>
                <p className="text-sm text-gray-600">
                    {error ?? "Please wait while we open your account."}
                </p>
                {error ? (
                    <Button asChild className="bg-blue-600 hover:bg-blue-700">
                        <Link href="/signin">Request a new link</Link>
                    </Button>
                ) : null}
            </div>
        </div>
    )
}

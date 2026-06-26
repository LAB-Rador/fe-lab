import { Button } from "@/src/components/ui/button"
import { useFormStatus } from "react-dom"

export const LoginSubmitButton = ({
    label,
    pendingLabel = "Signing in...",
}: {
    label: string
    pendingLabel?: string
}) => {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={pending}>
            {pending ? pendingLabel : label}
        </Button>
    )
}
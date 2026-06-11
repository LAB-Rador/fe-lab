import { Button } from "@/src/components/ui/button"
import { useFormStatus } from "react-dom"

export const LoginSubmitButton = ({ label }: { label: string }) => {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={pending}>
            {pending ? "Signing in..." : label}
        </Button>
    )
}
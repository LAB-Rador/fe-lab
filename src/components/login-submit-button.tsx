import { ctaGlowClass } from "@/src/components/landing/cta-glow"
import Magnet from "@/src/components/react-bits/magnet"
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
        <Magnet wrapperClassName="w-full" innerClassName="w-full" padding={70} magnetStrength={5} disabled={pending}>
            <Button type="submit" className={`w-full ${ctaGlowClass}`} disabled={pending}>
                {pending ? pendingLabel : label}
            </Button>
        </Magnet>
    )
}
"use client"

import { requestMagicLinkAction, type MagicLinkState } from "@/src/app/signin/actions"
import { LoginSubmitButton } from "@/src/components/login-submit-button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { useActionState } from "react"

const initialState: MagicLinkState = {}

export function LoginForm() {
    const [state, formAction] = useActionState(requestMagicLinkAction, initialState)

    return (
        <form action={formAction} className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="name@laboratory.com"
                    className="w-full"
                />
                {state.fieldErrors?.email?.[0] ? (
                    <p className="text-sm text-red-500">{state.fieldErrors.email[0]}</p>
                ) : null}
                <p className="text-sm text-muted-foreground">We will email you a one-time sign-in link.</p>
            </div>
            {state.error ? <p className="text-sm text-red-500">{state.error}</p> : null}
            {state.success && state.message ? (
                <p className="text-sm text-emerald-400">{state.message}</p>
            ) : null}
            <LoginSubmitButton label="Email me a link" pendingLabel="Sending link..." />
        </form>
    )
}

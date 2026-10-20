"use client"

import { guestAction, type GuestState } from "@/src/app/signin/guestAction"
import { requestMagicLinkAction, type MagicLinkState } from "@/src/app/signin/actions"
import { LoginSubmitButton } from "@/src/components/login-submit-button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { useActionState } from "react"

const initialState: MagicLinkState = {}
const guestInitialState: GuestState = {}

export function LoginForm() {
    const [state, formAction] = useActionState(requestMagicLinkAction, initialState)
    const [guestState, guestFormAction] = useActionState(guestAction, guestInitialState)

    return (
        <>
            <form action={formAction} className="mt-8 space-y-6">
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
                    <p className="text-sm text-gray-500">We will email you a one-time sign-in link.</p>
                </div>
                {state.error ? <p className="text-sm text-red-500">{state.error}</p> : null}
                {state.success && state.message ? (
                    <p className="text-sm text-green-700">{state.message}</p>
                ) : null}
                <LoginSubmitButton label="Email me a link" pendingLabel="Sending link..." />
            </form>
            <form action={guestFormAction} className="mt-4">
                {guestState.error ? <p className="text-sm text-red-500">{guestState.error}</p> : null}
                <LoginSubmitButton label="Guest access" pendingLabel="Signing in..." />
            </form>
        </>
    )
}

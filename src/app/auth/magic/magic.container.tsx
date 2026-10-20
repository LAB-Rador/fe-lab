"use client"

import { consumeMagicLinkFormAction } from "./actions"
import MagicLinkView from "./magic.view"
import { useActionState, useEffect, useRef } from "react"

const initialState: { error?: string } = {}

export default function MagicLinkContainer({ token }: { token: string }) {
    const [state, formAction] = useActionState(consumeMagicLinkFormAction, initialState)
    const formRef = useRef<HTMLFormElement>(null)

    const started = useRef(false)

    useEffect(() => {
        if (!token || started.current) return
        const flag = window as Window & { __magicLinkToken?: string }
        if (flag.__magicLinkToken === token) return
        flag.__magicLinkToken = token
        started.current = true
        formRef.current?.requestSubmit()
    }, [token])

    return (
        <form ref={formRef} action={formAction}>
            <input type="hidden" name="token" value={token} />
            <MagicLinkView error={token ? state.error : "This link is invalid or has expired."} />
        </form>
    )
}

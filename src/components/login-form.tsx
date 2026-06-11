"use client"

import { guestAction, type GuestState } from "@/src/app/signin/guestAction"
import { LoginSubmitButton } from "@/src/components/login-submit-button"
import { loginAction, type LoginState } from "@/src/app/signin/actions"
import { EyeIcon, EyeOffIcon } from "lucide-react"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { useActionState } from "react"
import { useState } from "react"
import Link from "next/link"

const initialState: LoginState = {}
const guestInitialState: GuestState = {}

export function LoginForm() {
  const [guestState, guestFormAction] = useActionState(guestAction, guestInitialState)
  const [state, formAction] = useActionState(loginAction, initialState)
  const [showPassword, setShowPassword] = useState(false)
  return (

    <>
      <form action={formAction} className="mt-8 space-y-6">
        <div className="space-y-4">
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
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link href="/forgot-password" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                placeholder="••••••••"
                className="w-full pr-10"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {!showPassword ? (
                  <EyeOffIcon className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <EyeIcon className="h-5 w-5" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>
        {state.error ? (
          <p className="text-sm text-red-500">{state.error}</p>
          ) : null}
        <LoginSubmitButton label="Sign in" />
      </form>
      <form action={guestFormAction}>
        <input type="hidden" name="email" value={process.env.NEXT_PUBLIC_GUEST_EMAIL} />
        <input type="hidden" name="password" value={process.env.NEXT_PUBLIC_GUEST_PASSWORD} />
        {guestState.error ? (
          <p className="text-sm text-red-500">{guestState.error}</p>
        ) : null}
        <LoginSubmitButton label="Guest access" />
      </form>
    </>
  )
}

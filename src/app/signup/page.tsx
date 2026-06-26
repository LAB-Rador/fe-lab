"use client"

import { signUpAction, type SignUpState } from "@/src/app/signup/actions"
import { LoginSubmitButton } from "@/src/components/login-submit-button"
import { setUser, type userTypes } from "@/src/redux/slices/userSlice"
import { EyeIcon, EyeOffIcon, ArrowLeft } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { useAppDispatch } from "@/src/lib/hooks"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useActionState } from "react"
import Link from "next/link"

const initialState: SignUpState = {}

export default function SignUpPage() {
  const [state, formAction] = useActionState(signUpAction, initialState)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const dispatch = useAppDispatch()
  const router = useRouter()

  useEffect(() => {
    if (!state.success || !state.user) return

    dispatch(setUser(state.user as unknown as userTypes))
    router.push("/signin")
  }, [state.success, state.user, dispatch, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="flex justify-start">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>

        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-600">
            <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 7.172V5L8 4z"
              />
            </svg>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Create your account</h2>
          <p className="mt-2 text-center text-sm text-gray-600">Join the leading laboratory management platform</p>
        </div>

        <form action={formAction} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" name="firstName" type="text" placeholder="John" />
                {state.fieldErrors?.firstName?.[0] ? (
                  <p className="text-sm text-red-500">{state.fieldErrors.firstName[0]}</p>
                ) : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" name="lastName" type="text" placeholder="Doe" />
                {state.fieldErrors?.lastName?.[0] ? (
                  <p className="text-sm text-red-500">{state.fieldErrors.lastName[0]}</p>
                ) : null}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="institution">Institution/Organization</Label>
                <Input id="institution" name="institution" type="text" placeholder="MyCompany Inc." />
                {state.fieldErrors?.institution?.[0] ? (
                  <p className="text-sm text-red-500">{state.fieldErrors.institution[0]}</p>
                ) : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  type="text"
                  placeholder="123 Research Drive, Science City, SC 12345"
                />
                {state.fieldErrors?.address?.[0] ? (
                  <p className="text-sm text-red-500">{state.fieldErrors.address[0]}</p>
                ) : null}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Contact Email</Label>
                <Input id="email" name="email" type="email" placeholder="contact@laboratory.com" />
                {state.fieldErrors?.email?.[0] ? (
                  <p className="text-sm text-red-500">{state.fieldErrors.email[0]}</p>
                ) : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactPhone">Contact Phone</Label>
                <Input id="contactPhone" name="contactPhone" type="tel" placeholder="+1 (555) 123-4567" />
                {state.fieldErrors?.contactPhone?.[0] ? (
                  <p className="text-sm text-red-500">{state.fieldErrors.contactPhone[0]}</p>
                ) : null}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="••••••••"
                  className="pr-10"
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
              {state.fieldErrors?.password?.[0] ? (
                <p className="text-sm text-red-500">{state.fieldErrors.password[0]}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="••••••••"
                  className="pr-10"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-500"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {!showConfirmPassword ? (
                    <EyeOffIcon className="h-5 w-5" aria-hidden="true" />
                  ) : (
                    <EyeIcon className="h-5 w-5" aria-hidden="true" />
                  )}
                </button>
              </div>
              {state.fieldErrors?.confirmPassword?.[0] ? (
                <p className="text-sm text-red-500">{state.fieldErrors.confirmPassword[0]}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="agreeToTerms"
                  name="agreeToTerms"
                  className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="agreeToTerms" className="ml-2 text-sm text-gray-700">
                  I agree to the{" "}
                  <Link href="/terms" className="text-blue-600 hover:text-blue-500 font-medium">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-blue-600 hover:text-blue-500 font-medium">
                    Privacy Policy
                  </Link>
                </label>
              </div>
              {state.fieldErrors?.agreeToTerms?.[0] ? (
                <p className="text-sm text-red-500">{state.fieldErrors.agreeToTerms[0]}</p>
              ) : null}
            </div>
          </div>

          {state.error ? <p className="text-sm text-red-500">{state.error}</p> : null}

          <LoginSubmitButton label="Create account" pendingLabel="Creating account..." />

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/signin" className="font-medium text-blue-600 hover:text-blue-500">
                Sign in here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

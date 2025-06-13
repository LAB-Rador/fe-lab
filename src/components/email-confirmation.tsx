"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { InputOTP, InputOTPGroup, InputOTPSlot } from './ui/input-otp'
import { useAppDispatch, useAppSelector } from '../lib/hooks'
import { updateUser } from "@/src/redux/slices/userSlice"
import { AlertCircle, CheckCircle } from 'lucide-react'
import type { RootState } from '../redux/store/store'
import { apiClient } from '../lib/apiClient'
import React, { useState } from 'react'
import { Button } from './ui/button'
import { Label } from './ui/label'
import { toast } from 'sonner'

export const EmailConfirmation = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [confirmationCode, setConfirmationCode] = useState("")
    const user = useAppSelector((state: RootState) => state.user)
    const dispatch = useAppDispatch()
    const handleConfirmEmail = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")
        setSuccess("")

        try {
            const response = await apiClient.post(
                "/api/auth/confirm-email", 
                {email: user.email, code: confirmationCode},
            );
            toast(`${response.message || response.error}`, {
              description: `${response?.data?.firstName} ${response?.data?.lastName} - ${response?.data?.institution}`
            })
            
            if(response.success) {
                dispatch(updateUser({confirmedEmail: response.data.confirmedEmail}))
            }
          } catch (error) {
            console.error('Verification code failed:', error);
          } finally {
            setIsLoading(false)
          }
    }

    const isJoinFormValid = confirmationCode.length === 6

    return (
        <Card>
            <CardHeader>
                <CardTitle>Confirm your email</CardTitle>
                <CardDescription>
                    Enter the 6-digit confirmation code provided to your email address.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleConfirmEmail} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="invitation-code">Confirmation Code</Label>
                        <div className="flex justify-center">
                        <InputOTP maxLength={6} value={confirmationCode} onChange={(value) => setConfirmationCode(value)}>
                            <InputOTPGroup>
                                <InputOTPSlot index={0} />
                                <InputOTPSlot index={1} />
                                <InputOTPSlot index={2} />
                                <InputOTPSlot index={3} />
                                <InputOTPSlot index={4} />
                                <InputOTPSlot index={5} />
                            </InputOTPGroup>
                        </InputOTP>
                        </div>
                        <p className="text-xs text-gray-600 text-center">
                        Enter the 6-digit confirmation code provided to your email address.
                        </p>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-md p-4">
                            <div className="flex items-center">
                                <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        </div>
                    )}

                    {success && (
                        <div className="bg-green-50 border border-green-200 rounded-md p-4">
                            <div className="flex items-center">
                                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                                <p className="text-sm text-green-700">{success}</p>
                            </div>
                        </div>
                    )}

                    <Button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        disabled={!isJoinFormValid || isLoading}
                    >
                        {isLoading ? "Confirming Email..." : "Confirm Email"}
                    </Button>

                    <div className="text-center">
                        <p className="text-sm text-gray-600">
                            Don't have a confirmation code?{" "}
                            <button
                                type="button"
                                className="font-medium text-blue-600 hover:text-blue-500"
                            >
                                Resend a new code
                            </button>
                        </p>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}

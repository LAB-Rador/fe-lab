"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { setLaboratory } from "@/src/redux/slices/laboratorySlice"
import { Building2, CheckCircle, AlertCircle } from "lucide-react"
import { Textarea } from "@/src/components/ui/textarea"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { useAppDispatch } from "@/src/lib/hooks"
import { apiClient } from "@/src/lib/apiClient"
import { AuthService } from "@/src/lib/auth"
import { useRouter } from "next/navigation"
import { useCallback, useMemo, useState } from "react"
import { toast } from "sonner"

export default function LaboratorySetupPage() {
    const router = useRouter()
    const dispatch = useAppDispatch()
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [laboratoryData, setLaboratoryData] = useState({
        description: "",
        username: "",
        position: "",
        name: "",
    })

    const handleLaboratoryInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setLaboratoryData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }, [])

    const handleCreateLaboratory = useCallback(async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")
        setSuccess("")

        try {
            const user = await AuthService.getCurrentUser()

            if (!user?.userId) {
                setError("Authentication required. Please sign in again.")
                return
            }

            const response = await apiClient.post("/api/laboratory", {
                ...laboratoryData,
                userId: user.userId,
            })
            toast(response.success ? "Success!" : "Error!", {
                description: response.success ? `${response?.message} - ${response?.data?.name}` : response?.message,
            })

            if (response.success) {
                dispatch(setLaboratory(response?.data))
                setSuccess("Laboratory created successfully!")
                router.push("/account")
            } else {
                setError(response?.message)
            }
        } catch (createError) {
            console.error("Failed to create laboratory:", createError)
            setError("Failed to create laboratory. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }, [dispatch, laboratoryData, router])

    const isCreateFormValid = useMemo(() => laboratoryData.name.trim() !== "", [laboratoryData])

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl w-full space-y-8">
                <div className="text-center">
                    <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-600">
                        <Building2 className="h-6 w-6 text-white" />
                    </div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Set up your laboratory</h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Create a laboratory you own. Teammates join from the link in their invitation email.
                    </p>
                </div>

                <Card className="w-full">
                    <CardHeader>
                        <CardTitle>Create New Laboratory</CardTitle>
                        <CardDescription>
                            Set up your own laboratory and become the owner. You will be able to invite team members and manage the lab.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleCreateLaboratory} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="username">Username *</Label>
                                    <Input
                                        id="username"
                                        name="username"
                                        type="text"
                                        required
                                        placeholder="johndoe"
                                        value={laboratoryData.username}
                                        onChange={handleLaboratoryInputChange}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="position">Position *</Label>
                                    <Input
                                        id="position"
                                        name="position"
                                        type="text"
                                        required
                                        placeholder="Researchers"
                                        value={laboratoryData.position}
                                        onChange={handleLaboratoryInputChange}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="name">Laboratory Name *</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    type="text"
                                    required
                                    placeholder="Advanced Research Laboratory"
                                    value={laboratoryData.name}
                                    onChange={handleLaboratoryInputChange}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    placeholder="Brief description of your laboratory's research focus and activities..."
                                    value={laboratoryData.description}
                                    onChange={handleLaboratoryInputChange}
                                    rows={3}
                                />
                            </div>

                            {error ? (
                                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                                    <div className="flex items-center">
                                        <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                                        <p className="text-sm text-red-700">{error}</p>
                                    </div>
                                </div>
                            ) : null}

                            {success ? (
                                <div className="bg-green-50 border border-green-200 rounded-md p-4">
                                    <div className="flex items-center">
                                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                                        <p className="text-sm text-green-700">{success}</p>
                                    </div>
                                </div>
                            ) : null}

                            <Button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700"
                                disabled={!isCreateFormValid || isLoading}
                            >
                                {isLoading ? "Creating Laboratory..." : "Create Laboratory"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

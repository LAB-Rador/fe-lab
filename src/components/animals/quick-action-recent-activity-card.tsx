"use client"

import type { AnimalRecord } from "@/src/app/[labId]/animals/[id]/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Button } from "@/src/components/ui/button"
import { AlertCircle, FileText, Microscope, Pill, Stethoscope, Weight } from "lucide-react"
import type React from "react"

const typeIcon: Record<string, React.ElementType> = {
    ROUTINE_CHECK: Weight,
    MEDICATION: Pill,
    SAMPLING: Microscope,
    OBSERVATION: FileText,
    TREATMENT: Stethoscope,
    EMERGENCY: AlertCircle,
}

function typeLabel(value: string) {
    return value
        .split("_")
        .map((part) => part.charAt(0) + part.slice(1).toLowerCase())
        .join(" ")
}

function formatDate(value: string) {
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return "—"
    return date.toLocaleDateString("en-US", { timeZone: "UTC", year: "numeric", month: "short", day: "numeric" })
}

function activityDescription(record: AnimalRecord) {
    const notes = record.notes?.trim()
    if (notes) return notes
    const name = [record.createdBy?.firstName, record.createdBy?.lastName].filter(Boolean).join(" ")
    return name ? `Recorded by ${name}` : "Recorded by Unknown"
}

interface QuickActionRecentActivityCardProps {
    records: AnimalRecord[]
    onViewAll: () => void
}

export function QuickActionRecentActivityCard({ records, onViewAll }: QuickActionRecentActivityCardProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {records.length === 0 ? (
                    <p className="text-sm text-gray-500">No activity for this animal.</p>
                ) : (
                    records.map((record) => (
                        <ActivityItem
                            key={record.id}
                            icon={typeIcon[record.recordType] ?? FileText}
                            title={typeLabel(record.recordType)}
                            description={activityDescription(record)}
                            time={formatDate(record.date)}
                        />
                    ))
                )}

                <Button
                    type="button"
                    variant="link"
                    className="w-full text-blue-600 hover:text-blue-700 p-0 h-auto"
                    onClick={onViewAll}
                >
                    View all activity
                </Button>
            </CardContent>
        </Card>
    )
}

interface ActivityItemProps {
    icon: React.ElementType
    title: string
    description: string
    time: string
}

function ActivityItem({ icon: Icon, title, description, time }: ActivityItemProps) {
    return (
        <div className="flex items-start gap-3">
            <div className="bg-blue-50 rounded-full p-1.5">
                <Icon className="h-3.5 w-3.5 text-blue-600" />
            </div>
            <div className="flex-1 space-y-1">
                <p className="font-medium text-sm">{title}</p>
                <p className="text-xs text-gray-500">{description}</p>
            </div>
            <div className="text-xs text-gray-500">{time}</div>
        </div>
    )
}

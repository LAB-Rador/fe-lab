"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import { PageHeader } from "@/src/components/settings/page-header"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState, type ReactNode } from "react"

const SETTINGS_TABS = ["animal-types", "breeding", "subscription"]

function settingsTab(value: string | null | undefined) {
    return value && SETTINGS_TABS.includes(value) ? value : "animal-types"
}

export default function LaboratorySettings({
    animalTypes,
    breedingProtocols,
    subscription,
}: {
    animalTypes: ReactNode
    breedingProtocols: ReactNode
    subscription: ReactNode
}) {
    const router = useRouter()
    const pathname = usePathname()
    const requestedTab = useSearchParams().get("tab")
    const tabFromUrl = settingsTab(requestedTab)
    const [activeTab, setActiveTab] = useState(tabFromUrl)

    useEffect(() => {
        setActiveTab(tabFromUrl)
    }, [tabFromUrl])

    const selectTab = (value: string) => {
        setActiveTab(settingsTab(value))
        router.replace(`${pathname}?tab=${value}`, { scroll: false })
    }

    return (
        <div className="container mx-auto py-6 space-y-8 max-w-7xl">
            <PageHeader title="Laboratory Settings" description="Manage your laboratory configuration and preferences" />

            <Tabs value={activeTab} onValueChange={selectTab} className="space-y-4">
                <TabsList className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-20 md:mb-0">
                    <TabsTrigger value="animal-types">Animal Types</TabsTrigger>
                    <TabsTrigger value="breeding">Breeding Protocols</TabsTrigger>
                    <TabsTrigger value="subscription">Subscription</TabsTrigger>
                </TabsList>

                <TabsContent value="animal-types">
                    {animalTypes}
                </TabsContent>

                <TabsContent value="breeding">
                    {breedingProtocols}
                </TabsContent>

                <TabsContent value="subscription">
                    {subscription}
                </TabsContent>
            </Tabs>
        </div>
    )
}

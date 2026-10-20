"use client"

import { BreedingProtocolsSettings } from "@/src/components/settings/breeding-protocols-settings"
import { SubscriptionSettings } from "@/src/components/settings/subscription-settings"
import { NotificationSettings } from "@/src/components/settings/notification-settings"
import { AnimalTypesSettings } from "@/src/components/settings/animal-type-settings"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import { UserRolesSettings } from "@/src/components/settings/user-roles-settings"
import { PageHeader } from "@/src/components/settings/page-header"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

const SETTINGS_TABS = ["animal-types", "user-roles", "breeding", "notifications", "subscription"]

function settingsTab(value: string | null | undefined) {
    return value && SETTINGS_TABS.includes(value) ? value : "animal-types"
}

export default function LaboratorySettings() {
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
                <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-20 md:mb-0">
                    <TabsTrigger value="animal-types">Animal Types</TabsTrigger>
                    <TabsTrigger value="user-roles">User Roles</TabsTrigger>
                    <TabsTrigger value="breeding">Breeding Protocols</TabsTrigger>
                    <TabsTrigger value="notifications">Notifications</TabsTrigger>
                    <TabsTrigger value="subscription">Subscription</TabsTrigger>
                </TabsList>

                <TabsContent value="animal-types">
                    <AnimalTypesSettings />
                </TabsContent>

                <TabsContent value="user-roles">
                    <UserRolesSettings />
                </TabsContent>

                <TabsContent value="breeding">
                    <BreedingProtocolsSettings />
                </TabsContent>

                <TabsContent value="notifications">
                    <NotificationSettings />
                </TabsContent>

                <TabsContent value="subscription">
                    <SubscriptionSettings />
                </TabsContent>
            </Tabs>
        </div>
    )
}

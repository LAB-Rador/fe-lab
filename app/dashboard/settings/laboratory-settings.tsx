"use client"

import { BreedingProtocolsSettings } from "@/components/settings/breeding-protocols-settings"
import { SubscriptionSettings } from "@/components/settings/subscription-settings"
import { NotificationSettings } from "@/components/settings/notification-settings"
import { AnimalTypesSettings } from "@/components/settings/animal-type-settings"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserRolesSettings } from "@/components/settings/user-roles-settings"
import { PageHeader } from "@/components/settings/page-header"
import { useState } from "react"

export default function LaboratorySettings() {
    const [activeTab, setActiveTab] = useState("animal-types")

    return (
        <div className="container mx-auto py-6 space-y-8 max-w-7xl">
            <PageHeader title="Laboratory Settings" description="Manage your laboratory configuration and preferences" />

            <Tabs defaultValue="animal-types" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-2">
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

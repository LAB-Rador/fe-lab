"use client"

import type { LaboratoriesContainerProps, Laboratory, ProfileDraft, UserInfo } from "./types"
import { useState, useCallback, useMemo } from "react"
import { getInitials } from "@/src/lib/utils"
import { apiClient } from "@/src/lib/apiClient"
import { AuthService } from "@/src/lib/auth"
import { useRouter } from "next/navigation"
import LaboratoriesView from "./labs.view"

function draftFromUser(user: UserInfo): ProfileDraft {
    return {
        firstName: user.firstName ?? "",
        lastName: user.lastName ?? "",
        institution: user.institution ?? "",
        contactPhone: user.contactPhone ?? "",
        address: user.address ?? "",
    }
}

export default function LaboratoriesContainer({ userLaboratories, initialUser }: LaboratoriesContainerProps) {
    const router = useRouter()
    const [searchTerm, setSearchTerm] = useState<string>("")
    const [laboratories] = useState<Laboratory[] | []>(userLaboratories)
    const [userInfo, setUserInfo] = useState<UserInfo>(initialUser)
    const [profileOpen, setProfileOpen] = useState(!initialUser.firstName)
    const [profileDraft, setProfileDraft] = useState<ProfileDraft>(draftFromUser(initialUser))
    const [profileError, setProfileError] = useState("")
    const [profileSaving, setProfileSaving] = useState(false)
    const isLoading = false

    const filteredLaboratories = useMemo(() => 
        laboratories?.filter(
            (lab) =>
            lab.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lab.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lab.description?.toLowerCase().includes(searchTerm.toLowerCase()),
        ),
        [laboratories, searchTerm]
    );

    const formatDate = useCallback((date: Date | string) => {
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        
        if (isNaN(dateObj.getTime())) {
            return 'Invalid date';
        }
        
        return new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "long", 
            day: "numeric",
        }).format(dateObj);
    }, []);

    const handleLabClick = useCallback((labId: string) => {
        router.push(`/${labId}/dashboard`)
    }, [router]);
    
    const handleCreateLab = useCallback(() => {
        router.push("/laboratory-setup")
    }, [router]);

    const handleLogout = useCallback(() => {
        AuthService.logout()
    }, [])

    const handleSaveProfile = useCallback(async () => {
        if (!profileDraft.firstName.trim()) {
            setProfileError("First name is required.")
            return
        }
        setProfileSaving(true)
        setProfileError("")
        try {
            const response = await apiClient.put(`/api/users/${userInfo.userId}/profile`, profileDraft)
            if (!response?.success) {
                setProfileError(response?.message ?? "Could not save profile.")
                return
            }
            const saved = response.data
            const nextUser: UserInfo = {
                ...userInfo,
                firstName: saved.firstName,
                lastName: saved.lastName,
                institution: saved.institution,
                contactPhone: saved.contactPhone,
                address: saved.address,
            }
            setUserInfo(nextUser)
            setProfileDraft(draftFromUser(nextUser))
            setProfileOpen(false)
        } catch {
            setProfileError("Could not save profile.")
        } finally {
            setProfileSaving(false)
        }
    }, [profileDraft, userInfo])

    return (
        <LaboratoriesView
            filteredLaboratories={filteredLaboratories}
            handleCreateLab={handleCreateLab}
            handleSaveProfile={handleSaveProfile}
            handleLabClick={handleLabClick}
            setProfileDraft={setProfileDraft}
            setProfileOpen={setProfileOpen}
            setSearchTerm={setSearchTerm}
            profileSaving={profileSaving}
            profileDraft={profileDraft}
            profileError={profileError}
            profileOpen={profileOpen}
            handleLogout={handleLogout}
            getInitials={getInitials}
            formatDate={formatDate}
            searchTerm={searchTerm}
            isLoading={isLoading}
            userInfo={userInfo}
        />
    )
}

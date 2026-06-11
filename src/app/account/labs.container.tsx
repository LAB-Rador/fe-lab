"use client"

import type { LaboratoriesContainerProps, Laboratory, UserInfo } from "./types"
import { useState, useCallback, useMemo } from "react"
import { getInitials } from "@/src/lib/utils"
import { AuthService } from "@/src/lib/auth"
import { useRouter } from "next/navigation"
import LaboratoriesView from "./labs.view"

export default function LaboratoriesContainer({ userLaboratories, initialUser }: LaboratoriesContainerProps) {
    const router = useRouter()
    const [searchTerm, setSearchTerm] = useState<string>("")
    const [laboratories, setLaboratories] = useState<Laboratory[] | []>(userLaboratories)
    const userInfo = initialUser
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
    }, [userInfo, router]);
    
    const handleJoinLab = useCallback(() => {
        router.push("/laboratory-setup?tab=join")
    }, [router]);

    const handleCreateLab = useCallback(() => {
        router.push("/laboratory-setup?tab=create")
    }, [router]);

    const handleLogout = useCallback(() => {
        void AuthService.logout()
    }, [])

    return (
        <LaboratoriesView
            filteredLaboratories={filteredLaboratories}
            handleCreateLab={handleCreateLab}
            handleLabClick={handleLabClick}
            setSearchTerm={setSearchTerm}
            handleJoinLab={handleJoinLab}
            handleLogout={handleLogout}
            getInitials={getInitials}
            formatDate={formatDate}
            searchTerm={searchTerm}
            isLoading={isLoading}
            userInfo={userInfo}
        />
    )
}

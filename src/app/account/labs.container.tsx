"use client"

import type { LaboratoriesContainerProps, Laboratory, UserInfo } from "./types"
import { useState, useEffect, useCallback, useMemo } from "react"
import { AuthService } from "@/src/lib/auth"
import { useRouter } from "next/navigation"
import LaboratoriesView from "./labs.view"

export default function LaboratoriesContainer({ userLaboratories }: LaboratoriesContainerProps) {
    const router = useRouter()
    const [searchTerm, setSearchTerm] = useState<string>("")
    const [laboratories, setLaboratories] = useState<Laboratory[] | []>(userLaboratories)
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
        setIsLoading(true);

        const user = await AuthService.getCurrentUser();
        setUserInfo(user);

        setIsLoading(false);
        }

        fetchData()
    }, [])

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

    const getInitials = useCallback((firstName: string, lastName: string) => {
        return `${firstName.charAt(0)}${lastName.charAt(0)}`
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


    return (
        <LaboratoriesView
            filteredLaboratories={filteredLaboratories}
            handleCreateLab={handleCreateLab}
            handleLabClick={handleLabClick}
            setSearchTerm={setSearchTerm}
            handleJoinLab={handleJoinLab}
            getInitials={getInitials}
            formatDate={formatDate}
            searchTerm={searchTerm}
            isLoading={isLoading}
            userInfo={userInfo}
        />
    )
}

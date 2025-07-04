import { Building2, Plus, Users, Calendar, MapPin, Mail, User, ChevronRight, Search } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Avatar, AvatarFallback } from "@/src/components/ui/avatar"
import type { LaboratoriesViewProps } from "./types"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Badge } from "@/src/components/ui/badge"

export default function LaboratoriesView(
    {
        filteredLaboratories,
        handleCreateLab,
        handleLabClick,
        setSearchTerm,
        handleJoinLab,
        getInitials,
        formatDate,
        searchTerm,
        isLoading,
        userInfo,
    }: LaboratoriesViewProps) {

    if (isLoading) {
        return (
        <div className="min-h-screen bg-gray-50">
            {/* Loading skeleton */}
            <div className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="animate-pulse">
                <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                    <div className="space-y-2">
                    <div className="h-6 bg-gray-200 rounded w-48"></div>
                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                    </div>
                </div>
                </div>
            </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    </div>
                </div>
                ))}
            </div>
            </div>
        </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
        {/* Header with user info */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                    <Avatar className="h-16 w-16">
                        <AvatarFallback className="bg-blue-600 text-white text-lg font-semibold">
                        {userInfo && getInitials(userInfo.firstName || "", userInfo.lastName || "")}
                        </AvatarFallback>
                    </Avatar>

                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                        {userInfo?.firstName} {userInfo?.lastName}
                        </h1>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                        <div className="flex items-center">
                            <Building2 className="h-4 w-4 mr-1" />
                            {userInfo?.institution}
                        </div>
                        <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            Member since {userInfo && formatDate(userInfo.createdAt)}
                        </div>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                        <div className="flex items-center">
                            <Mail className="h-4 w-4 mr-1" />
                            {userInfo?.email}
                        </div>
                        {userInfo?.address && (
                            <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {userInfo.address}
                            </div>
                        )}
                        </div>
                    </div>
                    </div>

                    <div className="flex space-x-3">
                    <Button onClick={handleJoinLab} variant="outline" className="flex items-center">
                        <Users className="h-4 w-4 mr-2" />
                        Join Lab
                    </Button>
                    <Button onClick={handleCreateLab} className="bg-blue-600 hover:bg-blue-700 flex items-center">
                        <Plus className="h-4 w-4 mr-2" />
                        Create New Lab
                    </Button>
                    </div>
                </div>
                </div>
            </div>

            {/* Main content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Search and filters */}
                <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                    <div>
                    <h2 className="text-xl font-semibold text-gray-900">Your Laboratories</h2>
                    <p className="text-gray-600 mt-1">
                        {filteredLaboratories.length} laborator{filteredLaboratories.length !== 1 ? "ies" : "y"} available
                    </p>
                    </div>
                </div>

                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                    type="text"
                    placeholder="Search laboratories..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                    />
                </div>
                </div>

                {/* Laboratory cards */}
                {filteredLaboratories.length === 0 ? (
                <div className="text-center py-12">
                    <Building2 className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No laboratories found</h3>
                    <p className="mt-1 text-sm text-gray-500">
                    {searchTerm
                        ? "Try adjusting your search terms."
                        : "Get started by creating a new laboratory or joining an existing one."}
                    </p>
                    <div className="mt-6 flex justify-center space-x-3">
                    <Button onClick={handleJoinLab} variant="outline">
                        <Users className="h-4 w-4 mr-2" />
                        Join Lab
                    </Button>
                    <Button onClick={handleCreateLab} className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Create New Lab
                    </Button>
                    </div>
                </div>
                ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredLaboratories.map((lab) => (
                    <Card
                        key={lab.id}
                        className="hover:shadow-md transition-shadow duration-200 cursor-pointer group"
                        onClick={() => handleLabClick(lab.name)}
                    >
                        <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                        {lab.name}
                                    </CardTitle>
                                    <CardDescription className="mt-1">
                                        <div className="flex items-center text-sm text-gray-600">
                                            <User className="h-3 w-3 mr-1" />
                                            {lab.username}
                                        </div>
                                        <Badge variant="secondary" className="mt-1 text-xs">
                                            {lab.position}
                                        </Badge>
                                    </CardDescription>
                                </div>
                                <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                            </div>
                        </CardHeader>

                        <CardContent className="pt-0">
                            {lab.description && <p className="text-sm text-gray-600 mb-4 line-clamp-3">{lab.description}</p>}

                            <div className="flex items-center justify-between text-xs text-gray-500">
                                <div className="flex items-center">
                                    <Calendar className="h-3 w-3 mr-1" />
                                    Created {lab && formatDate(lab.createdAt)}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    ))}
                </div>
                )}
            </div>
        </div>
    )
}
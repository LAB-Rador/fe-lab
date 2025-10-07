import {AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle} from "@/src/components/ui/alert-dialog";
import {Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle} from "@/src/components/ui/dialog";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/src/components/ui/select";
import { InitialMembersTypes, NewMemberTypes, Departments, Roles } from "./types";
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar";
import { Mail, Phone, Plus, Search, Trash2, UserPlus } from "lucide-react";
import { Card, CardContent } from "@/src/components/ui/card";
import type { Dispatch, SetStateAction } from "react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Badge } from "@/src/components/ui/badge";

interface TeamViewProps {
    setIsDeleteDialogOpen: Dispatch<SetStateAction<boolean>>;
    setNewMember: Dispatch<SetStateAction<NewMemberTypes>>;
    setIsAddDialogOpen: Dispatch<SetStateAction<boolean>>;
    setDepartmentFilter: Dispatch<SetStateAction<string>>;
    setSearchQuery: Dispatch<SetStateAction<string>>;
    setRoleFilter: Dispatch<SetStateAction<string>>;
    handleDeleteMember: (id: string) => void;
    filteredMembers: InitialMembersTypes[];
    members: InitialMembersTypes[];
    isDeleteDialogOpen: boolean;
    handleAddMember: () => void;
    confirmDelete: () => void;
    newMember: NewMemberTypes;
    departmentFilter: string;
    isAddDialogOpen: boolean;
    searchQuery: string;
    roleFilter: string;
}

const departments: Departments[] = [
    Departments.ALL_DEPARTMENTS,
    Departments.NEUROBIOLOGY,
    Departments.BEHAVIORAL_SCIENCE,
    Departments.GENETICS,
    Departments.TOXICOLOGY,
    Departments.GENERAL_LAB,
];
  const roles: Roles[] = [
    Roles.ALL_ROLES,
    Roles.LEAD_RESEARCHER,
    Roles.SENIOR_RESEARCHER,
    Roles.RESEARCH_ASSOCIATE,
    Roles.LAB_TECHNICIAN,
    Roles.GRADUATE_ASSISTANT,
];

export default function TeamView (props: TeamViewProps) {
    const {
        setIsDeleteDialogOpen,
        setDepartmentFilter,
        setIsAddDialogOpen,
        handleDeleteMember,
        isDeleteDialogOpen,
        departmentFilter,
        isAddDialogOpen,
        filteredMembers,
        handleAddMember,
        setSearchQuery,
        setRoleFilter,
        confirmDelete,
        setNewMember,
        searchQuery,
        roleFilter,
        newMember,
        members,
    } = props;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Team Members</h1>
                <p className="text-gray-500">
                Manage your laboratory team and personnel
                </p>
            </div>
            <Button
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => setIsAddDialogOpen(true)}
            >
                <Plus className="mr-2 h-4 w-4" />
                Add Member
            </Button>
            </div>
    
            <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                type="search"
                placeholder="Search members..."
                className="pl-9 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            <div className="flex gap-2">
                <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                    {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                        {dept}
                    </SelectItem>
                    ))}
                </SelectContent>
                </Select>
    
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                    {roles.map((role) => (
                    <SelectItem key={role} value={role}>
                        {role}
                    </SelectItem>
                    ))}
                </SelectContent>
                </Select>
            </div>
            </div>
    
            <div className="grid grid-cols-1 text-sm text-gray-600">
            Showing {filteredMembers.length} of {members.length} members
            </div>
    
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMembers.map((member: InitialMembersTypes) => (
                <Card
                key={member.id}
                className="overflow-hidden hover:shadow-lg transition-shadow"
                >
                <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                    <Avatar className="h-16 w-16">
                        <AvatarImage
                        src={member.avatar || "/placeholder.svg"}
                        alt={member.name}
                        />
                        <AvatarFallback className="bg-blue-100 text-blue-600 text-lg">
                        {member.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                    </Avatar>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDeleteMember(member.id)}
                    >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete member</span>
                    </Button>
                    </div>
    
                    <div className="space-y-3">
                    <div>
                        <h3 className="font-semibold text-lg">{member.name}</h3>
                        <p className="text-sm text-gray-600">{member.role}</p>
                    </div>
    
                    <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                        {member.department}
                        </Badge>
                        <Badge
                        variant={
                            member.status === "active" ? "default" : "secondary"
                        }
                        className={
                            member.status === "active"
                            ? "bg-green-100 text-green-800 hover:bg-green-200"
                            : ""
                        }
                        >
                        {member.status}
                        </Badge>
                    </div>
    
                    <div className="space-y-2 pt-2 border-t border-gray-100">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="h-4 w-4" />
                        <a
                            href={`mailto:${member.email}`}
                            className="hover:text-blue-600 truncate"
                        >
                            {member.email}
                        </a>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="h-4 w-4" />
                        <span>{member.phone}</span>
                        </div>
                    </div>
    
                    <div className="pt-2 border-t border-gray-100">
                        <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Active Experiments</span>
                        <span className="font-semibold text-blue-600">
                            {member.activeExperiments}
                        </span>
                        </div>
                        <div className="flex justify-between text-sm mt-1">
                        <span className="text-gray-500">Join Date</span>
                        <span className="font-medium">{member.joinDate}</span>
                        </div>
                    </div>
                    </div>
                </CardContent>
                </Card>
            ))}
            </div>
    
            {filteredMembers.length === 0 && (
            <div className="text-center py-12">
                <UserPlus className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-semibold text-gray-900">
                No members found
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                Try adjusting your search or filter criteria.
                </p>
            </div>
            )}
    
            {/* Add Member Dialog */}
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                <DialogTitle>Add New Team Member</DialogTitle>
                <DialogDescription>
                    Enter the details of the new team member below.
                </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                    id="name"
                    placeholder="Dr. John Smith"
                    value={newMember.name}
                    onChange={(e) =>
                        setNewMember({ ...newMember, name: e.target.value })
                    }
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="role">Role *</Label>
                    <Select
                    value={newMember.role}
                    onValueChange={(value) =>
                        setNewMember({ ...newMember, role: value })
                    }
                    >
                    <SelectTrigger id="role">
                        <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Lead Researcher">
                        Lead Researcher
                        </SelectItem>
                        <SelectItem value="Senior Researcher">
                        Senior Researcher
                        </SelectItem>
                        <SelectItem value="Research Associate">
                        Research Associate
                        </SelectItem>
                        <SelectItem value="Lab Technician">Lab Technician</SelectItem>
                        <SelectItem value="Graduate Assistant">
                        Graduate Assistant
                        </SelectItem>
                    </SelectContent>
                    </Select>
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="department">Department *</Label>
                    <Select
                    value={newMember.department}
                    onValueChange={(value) =>
                        setNewMember({ ...newMember, department: value })
                    }
                    >
                    <SelectTrigger id="department">
                        <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Neurobiology">Neurobiology</SelectItem>
                        <SelectItem value="Behavioral Science">
                        Behavioral Science
                        </SelectItem>
                        <SelectItem value="Genetics">Genetics</SelectItem>
                        <SelectItem value="Toxicology">Toxicology</SelectItem>
                        <SelectItem value="General Lab">General Lab</SelectItem>
                    </SelectContent>
                    </Select>
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                    id="email"
                    type="email"
                    placeholder="john.smith@labassist.com"
                    value={newMember.email}
                    onChange={(e) =>
                        setNewMember({ ...newMember, email: e.target.value })
                    }
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={newMember.phone}
                    onChange={(e) =>
                        setNewMember({ ...newMember, phone: e.target.value })
                    }
                    />
                </div>
                </div>
                <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                </Button>
                <Button
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={handleAddMember}
                    disabled={
                    !newMember.name ||
                    !newMember.role ||
                    !newMember.department ||
                    !newMember.email
                    }
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Member
                </Button>
                </DialogFooter>
            </DialogContent>
            </Dialog>
    
            {/* Delete Confirmation Dialog */}
            <AlertDialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
            >
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the
                    team member from the system.
                </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                    onClick={confirmDelete}
                    className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                >
                    Delete
                </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
"use client";

import type { InitialMembersTypes } from "./types";
import TeamView from "./team.view";
import { useState } from "react";

interface TeamContainerProps{
    initialMembers: InitialMembersTypes[]
}

export default function TeamContainer(props: TeamContainerProps) {
    const {initialMembers} = props;

    const [departmentFilter, setDepartmentFilter] = useState("All Departments");
    const [memberToDelete, setMemberToDelete] = useState<string | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [roleFilter, setRoleFilter] = useState("All Roles");
    const [members, setMembers] = useState(initialMembers);
    const [searchQuery, setSearchQuery] = useState("");
    const [newMember, setNewMember] = useState({
        department: "",
        email: "",
        phone: "",
        role: "",
        name: "",
    });

  // Filter members based on search query and filters
  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.department.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDepartment =
      departmentFilter === "All Departments" ||
      member.department === departmentFilter;

    const matchesRole =
      roleFilter === "All Roles" || member.role === roleFilter;

    return matchesSearch && matchesDepartment && matchesRole;
  });

  // Handle add member
  const handleAddMember = () => {
    if (
      newMember.name &&
      newMember.role &&
      newMember.department &&
      newMember.email
    ) {
      const member = {
        id: `member-${Date.now()}`,
        name: newMember.name,
        role: newMember.role,
        department: newMember.department,
        email: newMember.email,
        phone: newMember.phone,
        joinDate: new Date().toISOString().split("T")[0],
        activeExperiments: 0,
        avatar: "/placeholder.svg?height=80&width=80",
        status: "active" as const,
      };
      setMembers([...members, member]);
      setIsAddDialogOpen(false);
      setNewMember({
        name: "",
        role: "",
        department: "",
        email: "",
        phone: "",
      });
    }
  };

  // Handle delete member
  const handleDeleteMember = (id: string) => {
    setMemberToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (memberToDelete) {
      setMembers(members.filter((member) => member.id !== memberToDelete));
      setIsDeleteDialogOpen(false);
      setMemberToDelete(null);
    }
  };

    return (
        <TeamView
            setIsDeleteDialogOpen={setIsDeleteDialogOpen}
            setDepartmentFilter={setDepartmentFilter}
            setIsAddDialogOpen={setIsAddDialogOpen}
            handleDeleteMember={handleDeleteMember}
            isDeleteDialogOpen={isDeleteDialogOpen}
            departmentFilter={departmentFilter}
            isAddDialogOpen={isAddDialogOpen}
            filteredMembers={filteredMembers}
            handleAddMember={handleAddMember}
            setSearchQuery={setSearchQuery}
            setRoleFilter={setRoleFilter}
            confirmDelete={confirmDelete}
            setNewMember={setNewMember}
            searchQuery={searchQuery}
            roleFilter={roleFilter}
            newMember={newMember}
            members={members}
        />
    );
};
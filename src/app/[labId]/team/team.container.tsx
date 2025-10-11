"use client";

import type { AnimalEnums, InitialMembersTypes } from "./types";
import TeamView from "./team.view";
import { useState } from "react";
import { apiClient } from "@/src/lib/apiClient";
import { toast } from "sonner";

interface TeamContainerProps{
    initialMembers: InitialMembersTypes[],
    animalEnums: AnimalEnums,
    userId: string,
    labId: string,
}

export default function TeamContainer(props: TeamContainerProps) {
    const {initialMembers, animalEnums, userId, labId} = props;

    const [memberToDelete, setMemberToDelete] = useState<string | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [roleFilter, setRoleFilter] = useState("All Roles");
    const [members, setMembers] = useState(initialMembers);
    const [searchQuery, setSearchQuery] = useState("");
    const [newMember, setNewMember] = useState({
        email: "",
        role: "",
    });

  // Filter members based on search query and filters
  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.department.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole =
      roleFilter === "All Roles" || member.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  // Handle add member
  const handleAddMember = async () => {
    try {
      if ( newMember.role && newMember.email ) {
        const member = {
          email: newMember.email,
          role: newMember.role,
          invitedBy: userId,
          labId: labId,
        };

        const response = await apiClient.post("/api/invitation", member);
        toast(response.message || response.error, {
          description: ``
        });
        if(response.success) {
          setIsAddDialogOpen(false);
          setNewMember({
            role: "",
            email: "",
          });
        }
      }
    } catch (error) {
      console.error("Failed to create Invitation:", error)
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
            setIsAddDialogOpen={setIsAddDialogOpen}
            handleDeleteMember={handleDeleteMember}
            isDeleteDialogOpen={isDeleteDialogOpen}
            isAddDialogOpen={isAddDialogOpen}
            filteredMembers={filteredMembers}
            handleAddMember={handleAddMember}
            setSearchQuery={setSearchQuery}
            setRoleFilter={setRoleFilter}
            confirmDelete={confirmDelete}
            setNewMember={setNewMember}
            searchQuery={searchQuery}
            animalEnums={animalEnums}
            roleFilter={roleFilter}
            newMember={newMember}
            members={members}
        />
    );
};
"use server"

import type { InitialMembersTypes } from "./types";
import { apiClient } from "@/src/lib/apiClient";
import TeamContainer from "./team.container";
import { cookies } from "next/headers";

// Mock data for team members
const initialMembers: InitialMembersTypes[] = [
  {
    id: "member-001",
    name: "Dr. Emily Chen",
    role: "Lead Researcher",
    department: "Neurobiology",
    email: "emily.chen@labassist.com",
    phone: "+1 (555) 123-4567",
    joinDate: "2021-03-15",
    activeExperiments: 5,
    avatar: "/placeholder.svg?height=80&width=80",
    status: "active",
  },
  {
    id: "member-002",
    name: "Dr. Michael Rodriguez",
    role: "Lead Researcher",
    department: "Behavioral Science",
    email: "michael.rodriguez@labassist.com",
    phone: "+1 (555) 234-5678",
    joinDate: "2020-08-22",
    activeExperiments: 3,
    avatar: "/placeholder.svg?height=80&width=80",
    status: "active",
  },
  {
    id: "member-003",
    name: "Dr. Sarah Johnson",
    role: "Senior Researcher",
    department: "Genetics",
    email: "sarah.johnson@labassist.com",
    phone: "+1 (555) 345-6789",
    joinDate: "2022-01-10",
    activeExperiments: 4,
    avatar: "/placeholder.svg?height=80&width=80",
    status: "active",
  },
  {
    id: "member-004",
    name: "Dr. James Wilson",
    role: "Research Associate",
    department: "Toxicology",
    email: "james.wilson@labassist.com",
    phone: "+1 (555) 456-7890",
    joinDate: "2021-11-05",
    activeExperiments: 2,
    avatar: "/placeholder.svg?height=80&width=80",
    status: "active",
  },
  {
    id: "member-005",
    name: "Dr. Lisa Thompson",
    role: "Research Associate",
    department: "Neurobiology",
    email: "lisa.thompson@labassist.com",
    phone: "+1 (555) 567-8901",
    joinDate: "2022-06-18",
    activeExperiments: 3,
    avatar: "/placeholder.svg?height=80&width=80",
    status: "active",
  },
  {
    id: "member-006",
    name: "Dr. Robert Kim",
    role: "Research Associate",
    department: "Behavioral Science",
    email: "robert.kim@labassist.com",
    phone: "+1 (555) 678-9012",
    joinDate: "2020-04-30",
    activeExperiments: 1,
    avatar: "/placeholder.svg?height=80&width=80",
    status: "inactive",
  },
  {
    id: "member-007",
    name: "Sarah Johnson",
    role: "Lab Technician",
    department: "General Lab",
    email: "sarah.j@labassist.com",
    phone: "+1 (555) 789-0123",
    joinDate: "2022-09-12",
    activeExperiments: 6,
    avatar: "/placeholder.svg?height=80&width=80",
    status: "active",
  },
  {
    id: "member-008",
    name: "Michael Davis",
    role: "Lab Technician",
    department: "General Lab",
    email: "michael.davis@labassist.com",
    phone: "+1 (555) 890-1234",
    joinDate: "2023-02-20",
    activeExperiments: 4,
    avatar: "/placeholder.svg?height=80&width=80",
    status: "active",
  },
  {
    id: "member-009",
    name: "Robert Davis",
    role: "Graduate Assistant",
    department: "Neurobiology",
    email: "robert.davis@labassist.com",
    phone: "+1 (555) 901-2345",
    joinDate: "2023-08-01",
    activeExperiments: 2,
    avatar: "/placeholder.svg?height=80&width=80",
    status: "active",
  },
  {
    id: "member-010",
    name: "Jennifer Lee",
    role: "Graduate Assistant",
    department: "Genetics",
    email: "jennifer.lee@labassist.com",
    phone: "+1 (555) 012-3456",
    joinDate: "2023-08-01",
    activeExperiments: 2,
    avatar: "/placeholder.svg?height=80&width=80",
    status: "active",
  },
];

interface TeamPageTypes {
  params: {
    labId: string
  }
}

export default async function TeamPage({params}: TeamPageTypes) {
  const { labId } = await params;
  const cookieStore = await cookies();
  const userId = await cookieStore.get('USER_ID')?.value || 'default';
  const animalEnums = await apiClient.get(`/api/animals/enums`);
  return (
    <TeamContainer 
      initialMembers={initialMembers}
      animalEnums={animalEnums.data}
      userId={userId}
      labId={labId}
    />
  );
}

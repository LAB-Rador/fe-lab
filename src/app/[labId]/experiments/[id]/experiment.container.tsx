"use client"

import type { InitialMembersTypes } from "../../team/types"
import { AccessStatus } from "@/src/app/account/types"
import { useState, useCallback, useMemo } from "react"
import { ExperimentView } from "./experiment.view"
import type { Animal } from "../../animals/types"
import { apiClient } from "@/src/lib/apiClient"
import type { Experiment } from "../types"
import { toast } from "sonner"

interface ExperimentContainerProps {
  labMembers: InitialMembersTypes[]
  experiment: Experiment
  experimentId: string
  labAnimals: Animal[]
  labId: string
  userId: string
}

export const ExperimentContainer = (props: ExperimentContainerProps) => {
  const { experiment, experimentId, labId, userId, labMembers, labAnimals } = props
  const [experimentData, setExperimentData] = useState<Experiment>({
    ...experiment,
    animals: experiment.animals ?? [],
    members: experiment.members ?? [],
  })
  const [addMembersOpen, setAddMembersOpen] = useState(false)
  const [memberSearch, setMemberSearch] = useState("")
  const [addAnimalsOpen, setAddAnimalsOpen] = useState(false)
  const [animalSearch, setAnimalSearch] = useState("")

  const canManageMembers = experimentData.createdById === userId

  const creatorLabRole = useMemo(
    () => labMembers.find((m) => m.userId === experimentData.createdById)?.role,
    [labMembers, experimentData.createdById],
  )

  const addCandidates = useMemo(() => {
    const onExperiment = new Set((experimentData.members ?? []).map((m) => m.userId))
    const q = memberSearch.trim().toLowerCase()
    return labMembers.filter((lm) => {
      if (lm.userId === experimentData.createdById || onExperiment.has(lm.userId)) return false
      if (lm.accessStatus !== AccessStatus.ACTIVE) return false
      if (!q) return true
      const name = `${lm.user.firstName ?? ""} ${lm.user.lastName ?? ""}`.toLowerCase()
      return name.includes(q) || lm.user.email.toLowerCase().includes(q)
    })
  }, [labMembers, experimentData.createdById, experimentData.members, memberSearch])

  const animalAddCandidates = useMemo(() => {
    const onExperiment = new Set((experimentData.animals ?? []).map((a) => a.id))
    const q = animalSearch.trim().toLowerCase()
    return labAnimals.filter((a) => {
      if (!a.id || onExperiment.has(a.id)) return false
      if (!q) return true
      const label = `${a.name ?? ""} ${a.identifier ?? ""}`.toLowerCase()
      return (
        label.includes(q) ||
        (a.animalType?.name ?? "").toLowerCase().includes(q) ||
        (a.strain ?? "").toLowerCase().includes(q)
      )
    })
  }, [labAnimals, experimentData.animals, animalSearch])

  const handleAddMember = useCallback(
    async (targetUserId: string) => {
      try {
        const response = await apiClient.post(
          `/api/experiments/${userId}/${labId}/${experimentId}/members`,
          { targetUserId },
        )
        if (response?.success && response.data) {
          setExperimentData((prev) => ({
            ...prev,
            members: [...(prev.members ?? []), response.data],
          }))
          setAddMembersOpen(false)
          setMemberSearch("")
          toast.success("Member added")
        } else {
          toast.error(response?.message ?? "Failed to add member")
        }
      } catch {
        toast.error("Failed to add member")
      }
    },
    [userId, labId, experimentId],
  )

  const handleRemoveMember = useCallback(
    async (targetUserId: string) => {
      try {
        const response = await apiClient.delete(
          `/api/experiments/${userId}/${labId}/${experimentId}/members/${targetUserId}`,
        )
        if (response?.success) {
          setExperimentData((prev) => ({
            ...prev,
            members: (prev.members ?? []).filter((m) => m.userId !== targetUserId),
          }))
          toast.success("Member removed")
        } else {
          toast.error(response?.message ?? "Failed to remove member")
        }
      } catch {
        toast.error("Failed to remove member")
      }
    },
    [userId, labId, experimentId],
  )

  const handleAddAnimal = useCallback(
    async (animalId: string) => {
      try {
        const response = await apiClient.post(
          `/api/experiments/${userId}/${labId}/${experimentId}/animals`,
          { animalId },
        )
        if (response?.success && response.data) {
          setExperimentData((prev) => ({
            ...prev,
            animals: [...prev.animals, response.data],
          }))
          setAddAnimalsOpen(false)
          setAnimalSearch("")
          toast.success("Animal added to experiment")
        } else {
          toast.error(response?.message ?? "Failed to add animal")
        }
      } catch {
        toast.error("Failed to add animal")
      }
    },
    [userId, labId, experimentId],
  )

  const handleRemoveAnimal = useCallback(
    async (animalId: string) => {
      try {
        const response = await apiClient.delete(
          `/api/experiments/${userId}/${labId}/${experimentId}/animals/${animalId}`,
        )
        if (response?.success) {
          setExperimentData((prev) => ({
            ...prev,
            animals: prev.animals.filter((a) => a.id !== animalId),
          }))
          toast.success("Animal removed from experiment")
        } else {
          toast.error(response?.message ?? "Failed to remove animal")
        }
      } catch {
        toast.error("Failed to remove animal")
      }
    },
    [userId, labId, experimentId],
  )

  return (
    <ExperimentView
      onAddMembersOpenChange={setAddMembersOpen}
      onAddAnimalsOpenChange={setAddAnimalsOpen}
      animalAddCandidates={animalAddCandidates}
      onAnimalSearchChange={setAnimalSearch}
      onMemberSearchChange={setMemberSearch}
      onRemoveMember={handleRemoveMember}
      onRemoveAnimal={handleRemoveAnimal}
      canManageMembers={canManageMembers}
      addAnimalsOpen={addAnimalsOpen}
      creatorLabRole={creatorLabRole}
      addMembersOpen={addMembersOpen}
      addCandidates={addCandidates}
      onAddAnimal={handleAddAnimal}
      onAddMember={handleAddMember}
      experiment={experimentData}
      memberSearch={memberSearch}
      animalSearch={animalSearch}
      labMembers={labMembers}
      userId={userId}
      labId={labId}
    />
  )
}

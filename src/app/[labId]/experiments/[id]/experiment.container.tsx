"use client"

import type { Experiment, ExperimentAnimalRecordRow, ExperimentMetricsData } from "../types"
import type { InitialMembersTypes } from "../../team/types"
import { AccessStatus } from "@/src/app/account/types"
import { useState, useCallback, useMemo } from "react"
import { ExperimentView } from "./experiment.view"
import type { Animal } from "../../animals/types"
import { apiClient } from "@/src/lib/apiClient"
import { toast } from "sonner"

interface ExperimentContainerProps {
  initialAnimalRecords: ExperimentAnimalRecordRow[]
  initialMetrics: ExperimentMetricsData | null
  labMembers: InitialMembersTypes[]
  experiment: Experiment
  experimentId: string
  labAnimals: Animal[]
  labId: string
  userId: string
}

export const ExperimentContainer = (props: ExperimentContainerProps) => {
  const { experiment, experimentId, labId, userId, labMembers, labAnimals, initialMetrics, initialAnimalRecords } =
    props
  const [experimentData, setExperimentData] = useState<Experiment>({
    ...experiment,
    animals: experiment.animals ?? [],
    members: experiment.members ?? [],
  })
  const [metrics, setMetrics] = useState<ExperimentMetricsData | null>(initialMetrics)
  const [addMembersOpen, setAddMembersOpen] = useState(false)
  const [memberSearch, setMemberSearch] = useState("")
  const [addAnimalsOpen, setAddAnimalsOpen] = useState(false)
  const [animalSearch, setAnimalSearch] = useState("")

  const canManageMembers = experimentData.createdById === userId

  const refreshMetrics = useCallback(async () => {
    try {
      const res = await apiClient.get(
        `/api/experiments/unique/${userId}/${labId}/${experimentId}/metrics`,
      )
      if (res?.success && res.data) {
        setMetrics(res.data as ExperimentMetricsData)
      }
    } catch {
      /* keep existing metrics */
    }
  }, [userId, labId, experimentId])

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
            animals: [...(prev.animals ?? []), response.data],
          }))
          setAddAnimalsOpen(false)
          setAnimalSearch("")
          toast.success("Animal added to experiment")
          void refreshMetrics()
        } else {
          toast.error(response?.message ?? "Failed to add animal")
        }
      } catch {
        toast.error("Failed to add animal")
      }
    },
    [userId, labId, experimentId, refreshMetrics],
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
            animals: (prev.animals ?? []).filter((a) => a.id !== animalId),
          }))
          toast.success("Animal removed from experiment")
          void refreshMetrics()
        } else {
          toast.error(response?.message ?? "Failed to remove animal")
        }
      } catch {
        toast.error("Failed to remove animal")
      }
    },
    [userId, labId, experimentId, refreshMetrics],
  )

  const reloadExperiment = useCallback(async () => {
    try {
      const res = await apiClient.get(`/api/experiments/unique/${userId}/${labId}/${experimentId}`)
      if (res?.success && res.data) {
        setExperimentData({
          ...res.data,
          animals: res.data.animals ?? [],
          members: res.data.members ?? [],
        })
      }
    } catch {
      toast.error("Failed to reload experiment")
    }
  }, [userId, labId, experimentId])

  const handleArchiveExperiment = useCallback(async () => {
    try {
      const res = await apiClient.post(`/api/experiments/${userId}/${labId}/${experimentId}/archive`, {})
      if (res?.success) {
        toast.success("Experiment archived")
        await reloadExperiment()
      } else {
        toast.error(res?.message ?? "Failed to archive")
      }
    } catch {
      toast.error("Failed to archive")
    }
  }, [userId, labId, experimentId, reloadExperiment])

  const handleUnarchiveExperiment = useCallback(async () => {
    try {
      const res = await apiClient.post(`/api/experiments/${userId}/${labId}/${experimentId}/unarchive`, {})
      if (res?.success) {
        toast.success("Experiment unarchived")
        await reloadExperiment()
      } else {
        toast.error(res?.message ?? "Failed to unarchive")
      }
    } catch {
      toast.error("Failed to unarchive")
    }
  }, [userId, labId, experimentId, reloadExperiment])

  return (
    <ExperimentView
      onUnarchiveExperiment={handleUnarchiveExperiment}
      onArchiveExperiment={handleArchiveExperiment}
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
      animalRecords={initialAnimalRecords}
      memberSearch={memberSearch}
      animalSearch={animalSearch}
      labMembers={labMembers}
      metrics={metrics}
      userId={userId}
      labId={labId}
    />
  )
}

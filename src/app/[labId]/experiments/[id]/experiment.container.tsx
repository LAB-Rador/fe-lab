"use client"

import type { Experiment, ExperimentAnimalRecordRow, ExperimentMetricsData, ExperimentTasksPagePayload, ExperimentTasksPagination, } from "../types"
import type { ExperimentTaskAssigneeOption, ExperimentTaskUpsertPayload } from "./tabs/experiment-tasks-tab"
import { useState, useCallback, useMemo, useEffect, useRef } from "react"
import type { InitialMembersTypes } from "../../team/types"
import { AccessStatus } from "@/src/app/account/types"
import { ExperimentView } from "./experiment.view"
import type { Animal } from "../../animals/types"
import { apiClient } from "@/src/lib/apiClient"
import { TaskStatus } from "../../tasks/types"
import type { Task } from "../../tasks/types"
import { toast } from "sonner"

interface ExperimentContainerProps {
  initialExperimentTasks?: ExperimentTasksPagePayload
  initialAnimalRecords: ExperimentAnimalRecordRow[]
  initialMetrics: ExperimentMetricsData | null
  labMembers: InitialMembersTypes[]
  experiment: Experiment
  experimentId: string
  labAnimals: Animal[]
  labId: string
  userId: string
}

const DEFAULT_EXPERIMENT_TASKS_PAGINATION: ExperimentTasksPagination = {
  currentPage: 1,
  totalPages: 1,
  pageSize: 10,
  totalCount: 0,
  hasPreviousPage: false,
  hasNextPage: false,
}

export const ExperimentContainer = (props: ExperimentContainerProps) => {
  const {
    experiment,
    experimentId,
    labId,
    userId,
    labMembers,
    labAnimals,
    initialMetrics,
    initialAnimalRecords,
    initialExperimentTasks,
  } = props
  const [experimentData, setExperimentData] = useState<Experiment>({
    ...experiment,
    animals: experiment.animals ?? [],
    members: experiment.members ?? [],
  })
  const [experimentTasks, setExperimentTasks] = useState<Task[]>(() => initialExperimentTasks?.items ?? [])
  const [metrics, setMetrics] = useState<ExperimentMetricsData | null>(initialMetrics)
  const [addMembersOpen, setAddMembersOpen] = useState(false)
  const [addAnimalsOpen, setAddAnimalsOpen] = useState(false)
  const [memberSearch, setMemberSearch] = useState("")
  const [animalSearch, setAnimalSearch] = useState("")
  const [tasksPagination, setTasksPagination] = useState<ExperimentTasksPagination>(
    () => initialExperimentTasks?.pagination ?? DEFAULT_EXPERIMENT_TASKS_PAGINATION,
  )
  const [tasksLoading, setTasksLoading] = useState(false)

  const paginationRef = useRef(tasksPagination)
  useEffect(() => {
    paginationRef.current = tasksPagination
  }, [tasksPagination])

  const experimentTasksRef = useRef(experimentTasks)
  useEffect(() => {
    experimentTasksRef.current = experimentTasks
  }, [experimentTasks])

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

  const experimentTaskAssignees: ExperimentTaskAssigneeOption[] = useMemo(() => {
    const out: ExperimentTaskAssigneeOption[] = []
    const seen = new Set<string>()
    const add = (
      userIdCandidate: string | undefined | null,
      first?: string | null | undefined,
      last?: string | null | undefined,
      email?: string | null | undefined,
    ) => {
      if (!userIdCandidate || seen.has(userIdCandidate)) return
      seen.add(userIdCandidate)
      const label = [first, last].filter(Boolean).join(" ").trim() || email?.trim() || userIdCandidate
      out.push({ id: userIdCandidate, label })
    }

    add(
      experimentData.createdBy?.id,
      experimentData.createdBy?.firstName,
      experimentData.createdBy?.lastName,
      experimentData.createdBy?.email,
    )
    for (const row of experimentData.members ?? []) {
      add(row.userId, row.user.firstName, row.user.lastName, row.user.email)
    }
    return out
  }, [experimentData])

  const loadExperimentTasks = useCallback(
    async (
      page: number,
      pageSize: number,
    ): Promise<{ items: Task[]; pagination: ExperimentTasksPagination } | null> => {
      setTasksLoading(true)
      try {
        const res = await apiClient.get(
          `/api/experiments/unique/${userId}/${labId}/${experimentId}/tasks?page=${page}&pageSize=${pageSize}`,
        )
        if (res?.success && res.data?.items != null && res.data.pagination != null) {
          const items = res.data.items as Task[]
          const pagination = res.data.pagination as ExperimentTasksPagination
          setExperimentTasks(items)
          setTasksPagination(pagination)
          return { items, pagination }
        }
        return null
      } catch {
        toast.error("Failed to load tasks")
        return null
      } finally {
        setTasksLoading(false)
      }
    },
    [userId, labId, experimentId],
  )

  const handleExperimentTasksPagination = useCallback(
    async (updates: { page?: number; pageSize?: number }) => {
      const prev = paginationRef.current
      const pageSize = updates.pageSize ?? prev.pageSize
      const page =
        updates.page !== undefined ? updates.page : updates.pageSize !== undefined ? 1 : prev.currentPage
      await loadExperimentTasks(page, pageSize)
    },
    [loadExperimentTasks],
  )

  const handleCreateExperimentTask = useCallback(
    async (payload: ExperimentTaskUpsertPayload) => {
      try {
        await apiClient.post(`/api/experiments/unique/${userId}/${labId}/${experimentId}/tasks`, {
          title: payload.title,
          description: payload.description,
          assignedToId: payload.assignedToId,
          dueDate: payload.dueDate,
          priority: payload.priority,
          status: payload.status,
        })
        toast.success("Task created")
        await loadExperimentTasks(1, paginationRef.current.pageSize)
      } catch {
        toast.error("Failed to create task")
      }
    },
    [userId, labId, experimentId, loadExperimentTasks],
  )

  const handleUpdateExperimentTask = useCallback(
    async (taskId: string, payload: ExperimentTaskUpsertPayload) => {
      try {
        await apiClient.put(`/api/experiments/unique/${userId}/${labId}/${experimentId}/tasks/${taskId}`, {
          title: payload.title,
          description: payload.description,
          assignedToId: payload.assignedToId,
          dueDate: payload.dueDate,
          priority: payload.priority,
          status: payload.status,
        })
        toast.success("Task updated")
        await loadExperimentTasks(paginationRef.current.currentPage, paginationRef.current.pageSize)
      } catch {
        toast.error("Failed to update task")
      }
    },
    [userId, labId, experimentId, loadExperimentTasks],
  )

  const handlePatchExperimentTaskStatus = useCallback(
    async (taskId: string, nextStatus: TaskStatus) => {
      const snapshot = experimentTasksRef.current
      const previous = snapshot.find((t) => t.id === taskId)
      if (!previous || previous.status === nextStatus) return

      setExperimentTasks((tasks) =>
        tasks.map((t) => (t.id === taskId ? { ...t, status: nextStatus } : t)),
      )

      try {
        const res = await apiClient.patch(
          `/api/experiments/unique/${userId}/${labId}/${experimentId}/tasks/${taskId}/status`,
          { status: nextStatus },
        )
        if (res?.success && res.data) {
          setExperimentTasks((tasks) =>
            tasks.map((t) => (t.id === taskId ? (res.data as Task) : t)),
          )
        }
        if (res?.success) {
          toast.success("Task status updated")
        }
      } catch {
        toast.error("Could not update task status")
        setExperimentTasks(snapshot)
      }
    },
    [userId, labId, experimentId],
  )

  const handleDeleteExperimentTask = useCallback(
    async (taskId: string) => {
      try {
        await apiClient.delete(
          `/api/experiments/unique/${userId}/${labId}/${experimentId}/tasks/${taskId}`,
        )
        toast.success("Task deleted")
        const pg = paginationRef.current
        const out = await loadExperimentTasks(pg.currentPage, pg.pageSize)
        if (
          out &&
          out.items.length === 0 &&
          out.pagination.totalCount > 0 &&
          out.pagination.currentPage > out.pagination.totalPages
        ) {
          await loadExperimentTasks(Math.max(1, out.pagination.totalPages), out.pagination.pageSize)
        }
      } catch {
        toast.error("Failed to delete task")
      }
    },
    [userId, labId, experimentId, loadExperimentTasks],
  )

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
      onExperimentTasksPagination={handleExperimentTasksPagination}
      onPatchExperimentTaskStatus={handlePatchExperimentTaskStatus}
      onDeleteExperimentTask={handleDeleteExperimentTask}
      onCreateExperimentTask={handleCreateExperimentTask}
      onUpdateExperimentTask={handleUpdateExperimentTask}
      onUnarchiveExperiment={handleUnarchiveExperiment}
      experimentTaskAssignees={experimentTaskAssignees}
      onArchiveExperiment={handleArchiveExperiment}
      experimentTasksPagination={tasksPagination}
      onAddMembersOpenChange={setAddMembersOpen}
      onAddAnimalsOpenChange={setAddAnimalsOpen}
      animalAddCandidates={animalAddCandidates}
      onAnimalSearchChange={setAnimalSearch}
      experimentsLoadingTasks={tasksLoading}
      onMemberSearchChange={setMemberSearch}
      animalRecords={initialAnimalRecords}
      onRemoveMember={handleRemoveMember}
      onRemoveAnimal={handleRemoveAnimal}
      canManageMembers={canManageMembers}
      experimentTasks={experimentTasks}
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
      metrics={metrics}
      userId={userId}
      labId={labId}
    />
  )
}

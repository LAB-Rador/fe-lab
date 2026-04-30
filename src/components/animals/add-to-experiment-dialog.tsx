"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/src/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog"
import { Input } from "@/src/components/ui/input"
import { apiClient } from "@/src/lib/apiClient"
import { Search } from "lucide-react"

export interface ExperimentListRow {
  id: string
  title: string
  status: string
  startDate: string
  endDate?: string | null
  createdById: string
  createdBy?: {
    firstName?: string | null
    lastName?: string | null
  }
}

export interface AddToExperimentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  animalId: string
  labId: string
  userId: string
  linkedExperimentIds: string[]
}

export function AddToExperimentDialog({
  open,
  onOpenChange,
  animalId,
  labId,
  userId,
  linkedExperimentIds,
}: AddToExperimentDialogProps) {
  const router = useRouter()
  const [experimentSearch, setExperimentSearch] = useState("")
  const [experiments, setExperiments] = useState<ExperimentListRow[]>([])
  const [loadingExperiments, setLoadingExperiments] = useState(false)
  const [addingExperimentId, setAddingExperimentId] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    let cancelled = false
    setLoadingExperiments(true)
    void (async () => {
      try {
        const res = await apiClient.get(`/api/experiments/${userId}/${labId}`)
        if (!cancelled && res?.success && Array.isArray(res.data)) {
          setExperiments(res.data as ExperimentListRow[])
        }
      } catch {
        if (!cancelled) {
          setExperiments([])
          toast.error("Failed to load experiments")
        }
      } finally {
        if (!cancelled) setLoadingExperiments(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [open, userId, labId])

  const addableExperiments = useMemo(() => {
    const linked = new Set(linkedExperimentIds)
    return experiments.filter((e) => e.createdById === userId && !linked.has(e.id))
  }, [experiments, userId, linkedExperimentIds])

  const filteredExperiments = useMemo(() => {
    const q = experimentSearch.trim().toLowerCase()
    if (!q) return addableExperiments
    return addableExperiments.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.id.toLowerCase().includes(q) ||
        (e.status ?? "").toLowerCase().includes(q),
    )
  }, [addableExperiments, experimentSearch])

  async function handleAddToExperiment(experimentId: string) {
    setAddingExperimentId(experimentId)
    try {
      const res = await apiClient.post(
        `/api/experiments/${userId}/${labId}/${experimentId}/animals`,
        { animalId },
      )
      if (res?.success) {
        toast.success("Animal added to experiment")
        onOpenChange(false)
        setExperimentSearch("")
        router.refresh()
      } else {
        toast.error((res as { message?: string })?.message ?? "Failed to add to experiment")
      }
    } catch {
      toast.error("Failed to add animal to experiment")
    } finally {
      setAddingExperimentId(null)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next)
        if (!next) setExperimentSearch("")
      }}
    >
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add to experiment</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-gray-500">
          Experiments you created in this lab. Only the experiment creator can attach animals.
        </p>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Search by title or ID..."
            className="pl-9"
            value={experimentSearch}
            onChange={(e) => setExperimentSearch(e.target.value)}
          />
        </div>
        <div className="max-h-[280px] space-y-2 overflow-y-auto">
          {loadingExperiments ? (
            <p className="py-6 text-center text-sm text-gray-500">Loading experiments…</p>
          ) : filteredExperiments.length === 0 ? (
            <p className="py-6 text-center text-sm text-gray-500">
              {addableExperiments.length === 0
                ? "No experiments available. Create an experiment or ensure this animal is not already linked."
                : "No experiments match your search."}
            </p>
          ) : (
            filteredExperiments.map((exp) => {
              const start = exp.startDate
                ? new Date(exp.startDate).toLocaleDateString()
                : "—"
              return (
                <div
                  key={exp.id}
                  className="flex items-center justify-between gap-2 rounded-md border border-gray-100 p-3"
                >
                  <div className="min-w-0">
                    <div className="truncate font-medium">{exp.title}</div>
                    <div className="truncate text-xs text-gray-400">{exp.id}</div>
                    <div className="truncate text-sm text-gray-600">
                      {exp.status} · starts {start}
                    </div>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    className="shrink-0 bg-blue-600 hover:bg-blue-700"
                    disabled={addingExperimentId !== null}
                    onClick={() => void handleAddToExperiment(exp.id)}
                  >
                    {addingExperimentId === exp.id ? "Adding…" : "Add"}
                  </Button>
                </div>
              )
            })
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

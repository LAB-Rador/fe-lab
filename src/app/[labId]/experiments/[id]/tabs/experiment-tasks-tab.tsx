"use client"

import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/src/components/ui/alert-dialog"
import { Pagination, PaginationContent, PaginationEllipsis,PaginationItem, PaginationLink, PaginationNext, PaginationPrevious,} from "@/src/components/ui/pagination"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/src/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table"
import { useResponsiveTableGridView } from "@/src/hooks/use-responsive-table-grid-view"
import { Edit, LayoutGrid, LayoutList, Loader2, Plus, Trash2 } from "lucide-react"
import { TaskPriority, TaskStatus } from "../../../tasks/types"
import { Card, CardContent } from "@/src/components/ui/card"
import type { ExperimentTasksPagination } from "../../types"
import { Textarea } from "@/src/components/ui/textarea"
import { useMemo, useState, useEffect } from "react"
import { Button } from "@/src/components/ui/button"
import { capitalizeEnum } from "@/src/lib/strings"
import { Badge } from "@/src/components/ui/badge"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import type { Task } from "../../../tasks/types"
import { cn } from "@/src/lib/utils"
import { Activity } from "react"

export interface ExperimentTaskAssigneeOption {
  id: string
  label: string
}

export type TasksTabSurface = "experiment-tabs" | "standalone"

export interface ExperimentTasksTabProps {
  onUpdateTask: (taskId: string, payload: ExperimentTaskUpsertPayload) => void | Promise<void>
  onPaginationChange: (next: { page?: number; pageSize?: number }) => void | Promise<void>
  onPatchTaskStatus: (taskId: string, status: TaskStatus) => void | Promise<void>
  onCreateTask: (payload: ExperimentTaskUpsertPayload) => void | Promise<void>
  onDeleteTask: (taskId: string) => void | Promise<void>
  assignees: ExperimentTaskAssigneeOption[]
  pagination: ExperimentTasksPagination
  experimentsLoadingTasks?: boolean
  surface?: TasksTabSurface
  emptyListMessage?: string
  deleteScopeLabel?: string
  noAssigneesLabel?: string
  sectionTitle?: string
  activeTab: string
  tasks: Task[]
}

export interface ExperimentTaskUpsertPayload {
  description?: string | null
  dueDate?: string | null
  priority: TaskPriority
  assignedToId: string
  status?: TaskStatus
  title: string
}

function formatDueDateRaw(iso?: string | null): string {
  if (!iso) return "—"
  const d = new Date(iso)
  return Number.isNaN(d.getTime()) ? "—" : d.toLocaleDateString()
}

// moved to shared util

function getUserDisplay(user: {
  firstName?: string | null
  lastName?: string | null
  email?: string | null
} | null | undefined): { primary: string; secondary?: string } {
  if (!user) return { primary: "—" }
  const composed = [user.firstName, user.lastName].filter(Boolean).join(" ").trim()
  const email = (user.email ?? "").trim()
  if (!composed && !email) return { primary: "—" }
  if (composed && email && composed !== email) return { primary: composed, secondary: email }
  return { primary: composed || email }
}

function getAssigneeDisplay(task: Task): { primary: string; secondary?: string } {
  return getUserDisplay(task.assignedTo)
}

const PRIORITY_BADGE_CLASS: Record<TaskPriority, string> = {
  [TaskPriority.LOW]: "border-slate-200 bg-slate-50 text-slate-800 hover:bg-slate-50",
  [TaskPriority.MEDIUM]: "border-amber-200 bg-amber-50 text-amber-950 hover:bg-amber-50",
  [TaskPriority.HIGH]: "border-orange-300 bg-orange-50 text-orange-950 hover:bg-orange-50",
  [TaskPriority.URGENT]: "border-red-300 bg-red-50 text-red-950 hover:bg-red-50",
}

const STATUS_SELECT_TRIGGER_CLASS: Record<TaskStatus, string> = {
  [TaskStatus.PENDING]: "border-slate-300/90 bg-white text-slate-800 hover:bg-slate-50",
  [TaskStatus.IN_PROGRESS]: "border-blue-400/70 bg-blue-50 text-blue-950 hover:bg-blue-50",
  [TaskStatus.COMPLETED]: "border-green-500/70 bg-green-50 text-green-950 hover:bg-green-50",
  [TaskStatus.CANCELLED]: "border-zinc-300 bg-zinc-100 text-zinc-700 hover:bg-zinc-100",
}

function TaskQuickStatusSelect(props: {
  disabled?: boolean
  status: TaskStatus
  taskId: string
  onPatchTaskStatus: (taskId: string, status: TaskStatus) => void | Promise<void>
}) {
  const { taskId, status, disabled, onPatchTaskStatus } = props
  return (
    <Select value={status} disabled={disabled} onValueChange={(v) => void onPatchTaskStatus(taskId, v as TaskStatus)}>
      <SelectTrigger
        aria-label={`Task status, currently ${capitalizeEnum(status)}`}
        className={cn(
          "h-9 w-[10.5rem] max-w-[min(100%,12rem)] text-left text-xs font-medium shadow-none",
          STATUS_SELECT_TRIGGER_CLASS[status],
        )}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent align="start" sideOffset={4}>
        {Object.values(TaskStatus).map((value) => (
          <SelectItem key={value} value={value} className="text-sm">
            {capitalizeEnum(value)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

interface TaskEditorDialogProps {
  open: boolean
  draft: Task | null
  assignees: ExperimentTaskAssigneeOption[]
  loading?: boolean
  noAssigneesLabel?: string
  onOpenChange: (open: boolean) => void
  onSubmit: (payload: ExperimentTaskUpsertPayload, editingId: string | null) => void | Promise<void>
}

function TaskEditorDialog(props: TaskEditorDialogProps) {
  const { open, draft, assignees, loading, noAssigneesLabel, onOpenChange, onSubmit } = props
  const mode = draft ? ("edit" as const) : ("create" as const)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [assignedToId, setAssignedToId] = useState("")
  const [dueRaw, setDueRaw] = useState("")
  const [priority, setPriority] = useState<TaskPriority>(TaskPriority.MEDIUM)
  const [status, setStatus] = useState<TaskStatus>(TaskStatus.PENDING)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!open) return
    if (draft) {
      setTitle(draft.title)
      setDescription(draft.description ?? "")
      setAssignedToId(draft.assignedToId)
      setDueRaw(draft.dueDate ? draft.dueDate.slice(0, 10) : "")
      setPriority(draft.priority)
      setStatus(draft.status)
    } else {
      setTitle("")
      setDescription("")
      setAssignedToId(assignees[0]?.id ?? "")
      setDueRaw("")
      setPriority(TaskPriority.MEDIUM)
      setStatus(TaskStatus.PENDING)
    }
  }, [open, draft, assignees])

  async function submit() {
    if (!title.trim() || !assignedToId || saving || loading) return
    const dueDate = dueRaw.trim().length === 0 ? null : new Date(`${dueRaw}T12:00:00.000Z`).toISOString()
    setSaving(true)
    try {
      await onSubmit(
        {
          title: title.trim(),
          description: description.trim().length === 0 ? null : description.trim(),
          assignedToId,
          dueDate,
          priority,
          ...(mode === "edit" ? { status } : {}),
        },
        draft?.id ?? null,
      )
      onOpenChange(false)
    } finally {
      setSaving(false)
    }
  }

  const canPickAssignee = assignees.length > 0
  const blocking = !!loading || !canPickAssignee

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Add task" : "Edit task"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <div>
            <Label htmlFor="et-title">Title</Label>
            <Input id="et-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Task title" />
          </div>
          <div>
            <Label htmlFor="et-desc">Description</Label>
            <Textarea id="et-desc" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="Optional" />
          </div>
          <div>
            <Label htmlFor="et-assign">Assignee</Label>
            {!canPickAssignee ? (
              <p className="text-sm text-gray-500">
                {noAssigneesLabel ?? "No experiment collaborators available."}
              </p>
            ) : (
              <Select value={assignedToId} onValueChange={setAssignedToId}>
                <SelectTrigger id="et-assign">
                  <SelectValue placeholder="Select assignee" />
                </SelectTrigger>
                <SelectContent>
                  {assignees.map((a) => (
                    <SelectItem key={a.id} value={a.id}>
                      {a.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
          <div>
            <Label htmlFor="et-due">Due date</Label>
            <Input id="et-due" type="date" value={dueRaw} onChange={(e) => setDueRaw(e.target.value)} />
          </div>
          <div>
            <Label>Priority</Label>
            <Select value={priority} onValueChange={(v) => setPriority(v as TaskPriority)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.values(TaskPriority).map((p) => (
                  <SelectItem key={p} value={p}>
                    {capitalizeEnum(p)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {mode === "edit" ? (
            <div>
              <Label>Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as TaskStatus)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(TaskStatus).map((s) => (
                    <SelectItem key={s} value={s}>
                      {capitalizeEnum(s)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : null}
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
            Cancel
          </Button>
          <Button type="button" disabled={blocking || saving || !title.trim() || !assignedToId} onClick={() => void submit()}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function ExperimentTasksTab(props: ExperimentTasksTabProps) {
  const {
    emptyListMessage = "No tasks yet. Use Add Task to assign work on this experiment.",
    sectionTitle = "Experiment Tasks",
    deleteScopeLabel = "experiment",
    surface = "experiment-tabs",
    experimentsLoadingTasks,
    activeTab = "tasks",
    onPaginationChange,
    onPatchTaskStatus,
    noAssigneesLabel,
    onCreateTask,
    onUpdateTask,
    onDeleteTask,
    pagination,
    assignees,
    tasks,
  } = props

  const { view, setView } = useResponsiveTableGridView()
  const [editorOpen, setEditorOpen] = useState(false)
  const [editorDraft, setEditorDraft] = useState<Task | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Task | null>(null)
  const [deleteWorking, setDeleteWorking] = useState(false)

  async function confirmDeleteTask() {
    if (!deleteTarget || deleteWorking) return
    const id = deleteTarget.id
    setDeleteWorking(true)
    try {
      await onDeleteTask(id)
      setDeleteTarget(null)
    } finally {
      setDeleteWorking(false)
    }
  }

  const currentPage = pagination.currentPage
  const totalPages = pagination.totalPages
  const itemsPerPage = pagination.pageSize
  const totalCount = pagination.totalCount
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = Math.min(startIndex + itemsPerPage, totalCount)

  const pageNumbers = useMemo(() => {
    const pages: number[] = []
    const maxVisiblePages = 5
    const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    const endPg = Math.min(totalPages, startPage + maxVisiblePages - 1)
    for (let i = startPage; i <= endPg; i++) pages.push(i)
    return pages
  }, [currentPage, totalPages])

  const handlePageChange = (page: number) => {
    void onPaginationChange({ page })
  }

  const handleItemsPerPageChange = (value: string) => {
    void onPaginationChange({ page: 1, pageSize: Number(value) })
  }

  async function submitEditor(payload: ExperimentTaskUpsertPayload, editingId: string | null) {
    if (editingId) {
      await onUpdateTask(editingId, payload)
    } else {
      await onCreateTask(payload)
    }
  }

  const renderPaginationFooter = (
    <>
      <div className="flex flex-col gap-4 px-4 py-4 border-t border-gray-200 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
          <span className="text-sm text-gray-700">
            Showing {totalCount === 0 ? 0 : `${startIndex + 1}`} to {endIndex} of {totalCount} entries
          </span>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">Rows per page:</span>
            <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
              <SelectTrigger className="h-8 w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[5, 10, 20, 50].map((n) => (
                  <SelectItem key={n} value={String(n)}>
                    {n}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {totalPages > 1 ? (
          <div className="flex justify-center sm:justify-end">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      if (pagination.hasPreviousPage) handlePageChange(currentPage - 1)
                    }}
                    className={!pagination.hasPreviousPage ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>

                {pageNumbers[0] > 1 && (
                  <>
                    <PaginationItem>
                      <PaginationLink href="#" onClick={(e) => void (e.preventDefault(), handlePageChange(1))}>
                        1
                      </PaginationLink>
                    </PaginationItem>
                    {pageNumbers[0] > 2 && (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}
                  </>
                )}

                {pageNumbers.map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      href="#"
                      onClick={(e) => void (e.preventDefault(), handlePageChange(page))}
                      isActive={currentPage === page}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                {pageNumbers[pageNumbers.length - 1] < totalPages ? (
                  <>
                    {pageNumbers[pageNumbers.length - 1] < totalPages - 1 ? (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    ) : null}
                    <PaginationItem>
                      <PaginationLink
                        href="#"
                        onClick={(e) => void (e.preventDefault(), handlePageChange(totalPages))}
                      >
                        {totalPages}
                      </PaginationLink>
                    </PaginationItem>
                  </>
                ) : null}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      if (pagination.hasNextPage) handlePageChange(currentPage + 1)
                    }}
                    className={!pagination.hasNextPage ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        ) : null}
      </div>
    </>
  )

  const rowsOrCards = experimentsLoadingTasks ? (
    <div className="flex justify-center py-12 text-gray-500">
      <Loader2 className="h-8 w-8 animate-spin" aria-label="Loading" />
    </div>
  ) : tasks.length === 0 ? (
    <p className="py-10 text-center text-sm text-gray-500">{emptyListMessage}</p>
  ) : view === "table" ? (
    <div className="overflow-x-auto rounded-md">
      <Table>
        <TableHeader>
          <TableRow className="border-b hover:bg-muted/40 bg-muted/30">
            <TableHead className="min-w-[200px] max-w-xl py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Task & description
            </TableHead>
            <TableHead className="min-w-[140px] py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground whitespace-nowrap">
              Created by
            </TableHead>
            <TableHead className="min-w-[140px] py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground whitespace-nowrap">
              Assignee
            </TableHead>
            <TableHead className="min-w-[100px] py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground whitespace-nowrap">
              Due
            </TableHead>
            <TableHead className="min-w-[110px] py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground whitespace-nowrap">
              Priority
            </TableHead>
            <TableHead className="min-w-[148px] py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground whitespace-nowrap">
              Status
            </TableHead>
            <TableHead className="min-w-[6.25rem] w-[6.75rem] py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground whitespace-nowrap">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => {
            const assignee = getAssigneeDisplay(task)
            const creator = getUserDisplay(task.createdBy)
            return (
              <TableRow key={task.id} className="align-top border-b hover:bg-muted/25">
                <TableCell className="max-w-xl py-4 align-top">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-semibold leading-snug text-foreground">{task.title}</span>
                    {task.description ? (
                      <p
                        className="text-sm leading-relaxed text-muted-foreground line-clamp-3 whitespace-normal"
                        title={task.description}
                      >
                        {task.description}
                      </p>
                    ) : (
                      <p className="text-xs italic text-muted-foreground/80">No description</p>
                    )}
                  </div>
                </TableCell>
                <TableCell className="align-top py-4">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-medium text-foreground">{creator.primary}</span>
                    {creator.secondary ? (
                      <span className="text-xs text-muted-foreground break-all">{creator.secondary}</span>
                    ) : null}
                  </div>
                </TableCell>
                <TableCell className="align-top py-4">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-medium text-foreground">{assignee.primary}</span>
                    {assignee.secondary ? (
                      <span className="text-xs text-muted-foreground break-all">{assignee.secondary}</span>
                    ) : null}
                  </div>
                </TableCell>
                <TableCell className="whitespace-nowrap py-4 text-sm align-top">{formatDueDateRaw(task.dueDate)}</TableCell>
                <TableCell className="align-top py-4">
                  <Badge variant="outline" className={cn("pointer-events-none font-normal", PRIORITY_BADGE_CLASS[task.priority])}>
                    {capitalizeEnum(task.priority)}
                  </Badge>
                </TableCell>
                <TableCell className="py-4 align-middle">
                  <TaskQuickStatusSelect
                    disabled={experimentsLoadingTasks}
                    taskId={task.id}
                    status={task.status}
                    onPatchTaskStatus={onPatchTaskStatus}
                  />
                </TableCell>
                <TableCell className="text-right py-4 align-middle">
                  <div className="flex items-center justify-end gap-0.5">
                    <Button
                      variant="ghost"
                      size="sm"
                      type="button"
                      className="h-9 w-9 shrink-0 p-0 text-muted-foreground hover:text-foreground"
                      title="Edit task"
                      disabled={experimentsLoadingTasks || deleteWorking}
                      onClick={() => {
                        setEditorDraft(task)
                        setEditorOpen(true)
                      }}
                    >
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      type="button"
                      className="h-9 w-9 shrink-0 p-0 text-muted-foreground hover:text-destructive"
                      title="Delete task"
                      disabled={experimentsLoadingTasks || deleteWorking}
                      onClick={() => setDeleteTarget(task)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete task</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  ) : (
    <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {tasks.map((task) => {
        const assignee = getAssigneeDisplay(task)
        const creator = getUserDisplay(task.createdBy)
        return (
          <div
            key={task.id}
            className="relative flex flex-col rounded-xl border border-border bg-card p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-base font-semibold leading-snug tracking-tight text-foreground">{task.title}</h3>
                  <Badge
                    variant="outline"
                    className={cn("text-[11px] font-normal", PRIORITY_BADGE_CLASS[task.priority])}
                  >
                    {capitalizeEnum(task.priority)}
                  </Badge>
                </div>
                {task.description ? (
                  <p className="mt-2 whitespace-normal text-sm leading-relaxed text-muted-foreground">{task.description}</p>
                ) : (
                  <p className="mt-2 text-xs italic text-muted-foreground">No description</p>
                )}
              </div>
              <div className="flex shrink-0 items-start gap-0.5">
                <Button
                  variant="ghost"
                  size="sm"
                  type="button"
                  className="h-9 w-9 shrink-0 p-0 text-muted-foreground hover:text-foreground"
                  title="Edit task"
                  disabled={experimentsLoadingTasks || deleteWorking}
                  onClick={() => {
                    setEditorDraft(task)
                    setEditorOpen(true)
                  }}
                >
                  <Edit className="h-4 w-4" />
                  <span className="sr-only">Edit</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  type="button"
                  className="h-9 w-9 shrink-0 p-0 text-muted-foreground hover:text-destructive"
                  title="Delete task"
                  disabled={experimentsLoadingTasks || deleteWorking}
                  onClick={() => setDeleteTarget(task)}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete task</span>
                </Button>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 border-t border-border/80 pt-4 sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Created by</p>
                <p className="mt-1 text-sm font-medium text-foreground">{creator.primary}</p>
                {creator.secondary ? (
                  <p className="mt-0.5 text-xs text-muted-foreground break-all">{creator.secondary}</p>
                ) : null}
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Assignee</p>
                <p className="mt-1 text-sm font-medium text-foreground">{assignee.primary}</p>
                {assignee.secondary ? (
                  <p className="mt-0.5 text-xs text-muted-foreground break-all">{assignee.secondary}</p>
                ) : null}
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Due date</p>
                <p className="mt-1 text-sm text-foreground">{formatDueDateRaw(task.dueDate)}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Status</p>
                <div className="mt-2">
                  <TaskQuickStatusSelect
                    disabled={experimentsLoadingTasks}
                    taskId={task.id}
                    status={task.status}
                    onPatchTaskStatus={onPatchTaskStatus}
                  />
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )

  const inner = (
    <>
      <div className="flex flex-wrap justify-between items-center gap-3">
        <h2 className="text-xl font-semibold">{sectionTitle}</h2>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 rounded-md border border-gray-200 p-0.5">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setView("table")}
              className={view === "table" ? "bg-gray-100" : ""}
              aria-pressed={view === "table"}
            >
              <LayoutList className="h-4 w-4" />
              <span className="sr-only">Table view</span>
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setView("grid")}
              className={view === "grid" ? "bg-gray-100" : ""}
              aria-pressed={view === "grid"}
            >
              <LayoutGrid className="h-4 w-4" />
              <span className="sr-only">Grid view</span>
            </Button>
          </div>
          <Button
            type="button"
            disabled={assignees.length === 0 || experimentsLoadingTasks}
            onClick={() => {
              setEditorDraft(null)
              setEditorOpen(true)
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Task
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          {rowsOrCards}
          {renderPaginationFooter}
        </CardContent>
      </Card>

      <AlertDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open && !deleteWorking) setDeleteTarget(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete task?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently removes &quot;{deleteTarget?.title ?? ""}&quot; from this {deleteScopeLabel}. This
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel type="button" disabled={deleteWorking}>
              Cancel
            </AlertDialogCancel>
            <Button
              type="button"
              variant="destructive"
              disabled={deleteWorking}
              onClick={() => void confirmDeleteTask()}
            >
              {deleteWorking ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />
                  Deleting…
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <TaskEditorDialog
        open={editorOpen}
        draft={editorDraft}
        assignees={assignees}
        loading={experimentsLoadingTasks}
        noAssigneesLabel={noAssigneesLabel}
        onOpenChange={(o) => {
          setEditorOpen(o)
          if (!o) setEditorDraft(null)
        }}
        onSubmit={(payload, id) => submitEditor(payload, id)}
      />
    </>
  )

  const shell =
    surface === "experiment-tabs" ? (
      <Activity mode={activeTab === "tasks" ? "visible" : "hidden"}>
        {inner}
      </Activity>
    ) : (
      <div className="space-y-6">{inner}</div>
    )

  return shell
}

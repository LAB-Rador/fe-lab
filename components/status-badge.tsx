import { cn } from "@/lib/utils"

type StatusType = "active" | "completed" | "pending" | "cancelled" | "critical"

interface StatusBadgeProps {
  status: StatusType
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const statusConfig = {
    active: {
      color: "bg-green-100 text-green-800 border-green-200",
      label: "Active",
    },
    completed: {
      color: "bg-blue-100 text-blue-800 border-blue-200",
      label: "Completed",
    },
    pending: {
      color: "bg-yellow-100 text-yellow-800 border-yellow-200",
      label: "Pending",
    },
    cancelled: {
      color: "bg-red-100 text-red-800 border-red-200",
      label: "Cancelled",
    },
    critical: {
      color: "bg-purple-100 text-purple-800 border-purple-200",
      label: "Critical",
    },
  }

  const config = statusConfig[status]

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        config.color,
        className,
      )}
    >
      {config.label}
    </span>
  )
}

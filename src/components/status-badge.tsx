import { cn } from "@/src/lib/utils"
import { ExperimentStatus } from "../app/account/types"

type StatusType = ExperimentStatus.ACTIVE | ExperimentStatus.COMPLETED | ExperimentStatus.PLANNED | ExperimentStatus.CANCELLED | ExperimentStatus.PAUSED

interface StatusBadgeProps {
  status: StatusType
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const statusConfig = {
    [ExperimentStatus.ACTIVE]: {
      color: "bg-green-100 text-green-800 border-green-200",
      label: ExperimentStatus.ACTIVE,
    },
    [ExperimentStatus.COMPLETED]: {
      color: "bg-blue-100 text-blue-800 border-blue-200",
      label: ExperimentStatus.COMPLETED,
    },
    [ExperimentStatus.PLANNED]: {
      color: "bg-yellow-100 text-yellow-800 border-yellow-200",
      label: ExperimentStatus.PLANNED,
    },
    [ExperimentStatus.CANCELLED]: {
      color: "bg-red-100 text-red-800 border-red-200",
      label: ExperimentStatus.CANCELLED,
    },
    [ExperimentStatus.PAUSED]: {
      color: "bg-purple-100 text-purple-800 border-purple-200",
      label: ExperimentStatus.PAUSED,
    },
  }

  const config = statusConfig[status]

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        config?.color,
        className,
      )}
    >
      {config?.label}
    </span>
  )
}

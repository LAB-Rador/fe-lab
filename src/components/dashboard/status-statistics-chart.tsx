"use client"

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/src/components/ui/chart"
import type { AnimalStatusCount } from "@/src/app/[labId]/dashboard/types"
import { useMemo } from "react"

const statusMapping = {
  ACTIVE: { label: "Active", color: "#10B981" },
  EXPERIMENT: { label: "Experiment", color: "#8B5CF6" },
  BREEDING: { label: "Breeding", color: "#3B82F6" },
  QUARANTINE: { label: "Quarantine", color: "#F59E0B" },
  TRANSFERRED: { label: "Transferred", color: "#6B7280" },
  RETIRED: { label: "Retired", color: "#84CC16" },
  DECEASED: { label: "Deceased", color: "#EF4444" },
} as const

function processStatusData(byStatus: AnimalStatusCount[]) {
  if (!byStatus || byStatus.length === 0) {
    return []
  }

  return byStatus
    .map((item) => ({
      name: statusMapping[item.status]?.label || item.status,
      value: item.count,
      color: statusMapping[item.status]?.color || "#6B7280",
      status: item.status,
    }))
    .sort((a, b) => b.value - a.value)
}

export function StatusStatisticsChart({byStatus}: {byStatus: AnimalStatusCount[]}) {
  const chartData = useMemo(() => processStatusData(byStatus), [byStatus])

  const config = useMemo(() => {
    if (!chartData || chartData.length === 0) return {}
    
    return chartData.reduce((acc, item) => {
      acc[item.status] = {
        label: item.name,
        color: item.color,
      }
      return acc
    }, {} as Record<string, { label: string; color: string }>)
  }, [chartData])

  if (!chartData || chartData.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center text-muted-foreground">
        No data to render!
      </div>
    )
  }

  return (
    <ChartContainer
      config={config}
      className="h-[300px] [display: contents] w-full md:w-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            labelLine={false}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<ChartTooltipContent />} />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}

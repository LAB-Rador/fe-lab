"use client"

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/src/components/ui/chart"
import type { Animal } from "@/src/app/[userId]/[labId]/dashboard/types"
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

function processStatusData(animals: Animal[]) {
  if (!animals || animals.length === 0) {
    return []
  }

  const statusCounts = animals.reduce((acc, animal) => {
    const status = animal.status
    if (!acc[status]) {
      acc[status] = 0
    }
    acc[status]++
    return acc
  }, {} as Record<string, number>)

  const chartData = Object.entries(statusCounts)
    .map(([status, count]) => ({
      name: statusMapping[status as keyof typeof statusMapping]?.label || status,
      value: count,
      color: statusMapping[status as keyof typeof statusMapping]?.color || "#6B7280",
      status: status
    }))
    .sort((a, b) => b.value - a.value)
  
  return chartData
}

export function StatusStatisticsChart({animals}: {animals: Animal[]}) {
  const chartData = useMemo(() => processStatusData(animals), [animals])

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
      className="h-[300px] w-[315px] md:w-full"
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

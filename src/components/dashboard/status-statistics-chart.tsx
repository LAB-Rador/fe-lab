"use client"

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/src/components/ui/chart"

const data = [
  { name: "Healthy", value: 850, color: "#10B981" },
  { name: "Under Observation", value: 250, color: "#F59E0B" },
  { name: "Critical", value: 50, color: "#EF4444" },
  { name: "In Experiment", value: 98, color: "#8B5CF6" },
]

export function StatusStatisticsChart() {
  return (
    <ChartContainer
      config={{
        healthy: {
          label: "Healthy",
          color: "#10B981",
        },
        observation: {
          label: "Under Observation",
          color: "#F59E0B",
        },
        critical: {
          label: "Critical",
          color: "#EF4444",
        },
        experiment: {
          label: "In Experiment",
          color: "#8B5CF6",
        },
      }}
      className="h-[300px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            labelLine={false}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<ChartTooltipContent />} />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}

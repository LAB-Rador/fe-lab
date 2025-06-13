"use client"

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/src/components/ui/chart"
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

interface WeightChartProps {
  measurements: any[]
}

export function WeightChart({ measurements }: WeightChartProps) {
  // Transform the data for the chart
  const chartData = measurements
    .map((m) => ({
      date: m.date,
      weight: Number.parseFloat(m.weight.replace("g", "")),
    }))
    .reverse()

  return (
    <ChartContainer
      config={{
        weight: {
          label: "Weight (g)",
          color: "hsl(var(--chart-1))",
        },
      }}
      className="h-[300px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
          <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={10} />
          <YAxis tickLine={false} axisLine={false} tickMargin={10} domain={["dataMin - 1", "dataMax + 1"]} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Line
            type="monotone"
            dataKey="weight"
            strokeWidth={2}
            activeDot={{ r: 6 }}
            isAnimationActive={true}
            animationDuration={1000}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}

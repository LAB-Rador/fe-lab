"use client"

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

interface TemperatureChartProps {
  measurements: any[]
}

export function TemperatureChart({ measurements }: TemperatureChartProps) {
  // Transform the data for the chart
  const chartData = measurements
    .map((m) => ({
      date: m.date,
      temperature: Number.parseFloat(m.temperature.replace("°C", "")),
    }))
    .reverse()

  return (
    <ChartContainer
      config={{
        temperature: {
          label: "Temperature (°C)",
          color: "hsl(var(--chart-2))",
        },
      }}
      className="h-[300px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
          <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={10} />
          <YAxis tickLine={false} axisLine={false} tickMargin={10} domain={["dataMin - 0.5", "dataMax + 0.5"]} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Line
            type="monotone"
            dataKey="temperature"
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

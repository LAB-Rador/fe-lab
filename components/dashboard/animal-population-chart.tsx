"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"

const data = [
  { date: "Jan 1", mice: 120, birds: 45, fish: 230 },
  { date: "Jan 5", mice: 132, birds: 42, fish: 235 },
  { date: "Jan 10", mice: 145, birds: 50, fish: 240 },
  { date: "Jan 15", mice: 155, birds: 55, fish: 245 },
  { date: "Jan 20", mice: 160, birds: 60, fish: 250 },
  { date: "Jan 25", mice: 170, birds: 65, fish: 255 },
  { date: "Jan 30", mice: 175, birds: 70, fish: 260 },
]

export function AnimalPopulationChart() {
  return (
    <ChartContainer
      config={{
        mice: {
          label: "Mice",
          color: "hsl(221, 83%, 53%)",
        },
        birds: {
          label: "Birds",
          color: "hsl(262, 80%, 50%)",
        },
        fish: {
          label: "Fish",
          color: "hsl(142, 71%, 45%)",
        },
      }}
      className="h-[300px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
          <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}`}
          />
          <Tooltip content={<ChartTooltipContent />} />
          <Line type="monotone" dataKey="mice" strokeWidth={2} activeDot={{ r: 6 }} stroke="hsl(221, 83%, 53%)" />
          <Line type="monotone" dataKey="birds" strokeWidth={2} activeDot={{ r: 6 }} stroke="hsl(262, 80%, 50%)" />
          <Line type="monotone" dataKey="fish" strokeWidth={2} activeDot={{ r: 6 }} stroke="hsl(142, 71%, 45%)" />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}

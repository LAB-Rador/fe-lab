"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/src/components/ui/chart"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import type { ExperimentMetricsData } from "../../types"
import { Activity } from "react"
import { useMemo } from "react"

interface ExperimentMetricsTabProps {
  metrics: ExperimentMetricsData | null
  activeTab: string
}

function formatChartDay(isoDay: string) {
  const [y, m, d] = isoDay.split("-").map(Number)
  if (!y || !m || !d) return isoDay
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  })
}

export function ExperimentMetricsTab({ metrics, activeTab }: ExperimentMetricsTabProps) {
  const chartData = useMemo(() => metrics?.series ?? [], [metrics?.series])

  const summaryLine = useMemo(() => {
    if (!metrics) return "Metrics unavailable."
    const { recordCount, animalCount } = metrics
    if (animalCount === 0) return "No animals linked to this experiment."
    if (recordCount === 0) return "No animal records for this cohort yet."
    return `${recordCount} record${recordCount === 1 ? "" : "s"} across ${animalCount} animal${animalCount === 1 ? "" : "s"}.`
  }, [metrics])

  const avgTemp = metrics?.averages.temperature
  const avgAct = metrics?.averages.activity
  const avgWeight = metrics?.averages.weight

  return (
    <Activity mode={activeTab === "metrics" ? "visible" : "hidden"}>
      <Card>
        <CardHeader>
          <CardTitle>Experiment Metrics</CardTitle>
          <p className="text-sm text-muted-foreground">{summaryLine}</p>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            {metrics && metrics.animalCount > 0 && metrics.recordCount > 0 ? (
              <ChartContainer
                config={{
                  temperature: {
                    label: "Temperature (°C)",
                    color: "hsl(var(--chart-1))",
                  },
                  activity: {
                    label: "Activity (1–5)",
                    color: "hsl(var(--chart-2))",
                  },
                  weight: {
                    label: "Weight (g)",
                    color: "hsl(var(--chart-3))",
                  },
                }}
                className="h-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="day"
                      tickFormatter={formatChartDay}
                      label={{ value: "Day", position: "insideBottomRight", offset: -5 }}
                    />
                    <YAxis label={{ value: "Value", angle: -90, position: "insideLeft" }} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="temperature"
                      stroke="var(--color-temperature)"
                      connectNulls
                      dot={{ r: 3 }}
                      activeDot={{ r: 8 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="activity"
                      stroke="var(--color-activity)"
                      connectNulls
                      dot={{ r: 3 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="weight"
                      stroke="var(--color-weight)"
                      connectNulls
                      dot={{ r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            ) : (
              <div className="flex h-full min-h-[280px] items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground">
                No chart data
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Average Temperature</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {avgTemp != null ? `${avgTemp.toFixed(1)}°C` : "—"}
            </div>
            <p className="text-sm text-gray-500">Mean over all cohort records with temperature</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Average Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{avgAct != null ? avgAct.toFixed(2) : "—"}</div>
            <p className="text-sm text-gray-500">Mean level score (1 = very low … 5 = very high)</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Average Weight</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{avgWeight != null ? `${avgWeight.toFixed(1)} g` : "—"}</div>
            <p className="text-sm text-gray-500">Mean over all cohort records with weight</p>
          </CardContent>
        </Card>
      </div>
    </Activity>
  )
}

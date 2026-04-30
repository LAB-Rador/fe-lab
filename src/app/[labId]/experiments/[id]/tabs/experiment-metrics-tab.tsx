"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/src/components/ui/chart"
import { TabsContent } from "@/src/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"

export function ExperimentMetricsTab() {
  return (
    <TabsContent value="metrics" className="space-y-6 mt-6">
      <Card>
        <CardHeader>
          <CardTitle>Experiment Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ChartContainer
              config={{
                temperature: {
                  label: "Temperature (°C)",
                  color: "hsl(var(--chart-1))",
                },
                activity: {
                  label: "Activity Level",
                  color: "hsl(var(--chart-2))",
                },
                stress: {
                  label: "Stress Indicators",
                  color: "hsl(var(--chart-3))",
                },
              }}
              className="h-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={[]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" label={{ value: "Day", position: "insideBottomRight", offset: -5 }} />
                  <YAxis label={{ value: "Value", angle: -90, position: "insideLeft" }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="temperature"
                    stroke="var(--color-temperature)"
                    activeDot={{ r: 8 }}
                  />
                  <Line type="monotone" dataKey="activity" stroke="var(--color-activity)" />
                  <Line type="monotone" dataKey="stress" stroke="var(--color-stress)" />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Average Temperature</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">24.5°C</div>
            <p className="text-sm text-gray-500">+2.5°C from baseline</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Average Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">35</div>
            <p className="text-sm text-gray-500">-10 from baseline</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Average Stress Level</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">45</div>
            <p className="text-sm text-gray-500">+15 from baseline</p>
          </CardContent>
        </Card>
      </div>
    </TabsContent>
  )
}

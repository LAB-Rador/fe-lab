import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/src/components/ui/chart"
import type { AnimalPopulationPoint } from "@/src/app/[labId]/dashboard/types"
import { useMemo } from "react"

const colors = [
  "hsl(221, 83%, 53%)",
  "hsl(262, 80%, 50%)",
  "hsl(142, 71%, 45%)",
  "hsl(346, 87%, 43%)",
  "hsl(43, 96%, 55%)",
  "hsl(178, 100%, 29%)",
  "hsl(280, 100%, 70%)",
  "hsl(24, 100%, 50%)",
]

function processAnimalData(population: AnimalPopulationPoint[]): { chartData: any[], animalTypes: string[] } {
  if (!population || population.length === 0) {
    return { chartData: [], animalTypes: [] }
  }

  const animalsByDate = population.reduce((acc, point) => {
    if (!acc[point.date]) acc[point.date] = {}
    acc[point.date][point.animalType] = point.count
    return acc
  }, {} as Record<string, Record<string, number>>)

  const allAnimalTypes = Array.from(new Set(population.map((point) => point.animalType)))
  
  const dateRange = []
  for (let i = 29; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    dateRange.push(date.toISOString().split('T')[0])
  }
  
  const chartData = dateRange.map(dateKey => {
    const formattedDate = new Date(dateKey).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short'
    })
    
    const dataPoint: any = { date: formattedDate }
    
    allAnimalTypes.forEach(type => {
      dataPoint[type] = (animalsByDate[dateKey] && animalsByDate[dateKey][type]) || 0
    })
    
    return dataPoint
  })

  return { chartData, animalTypes: allAnimalTypes }
}

export function AnimalPopulationChart({population}: {population: AnimalPopulationPoint[]}) {
  const { chartData, animalTypes } = useMemo(() => processAnimalData(population), [population])

  const config = useMemo(() => animalTypes.reduce((acc: Record<string, { label: string; color: string }>, type: string, index: number) => {
    acc[type] = {
      label: type,
      color: colors[index % colors.length],
    }
    return acc
  }, {} as Record<string, { label: string; color: string }>), [animalTypes])

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
      className="h-[300px]  [display: contents] w-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
          <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}`}
          />
          <Tooltip content={<ChartTooltipContent />} />
          {animalTypes.map((type: string, index: number) => (
            <Line
              key={type}
              type="monotone"
              dataKey={type}
              strokeWidth={2}
              activeDot={{ r: 6 }}
              stroke={colors[index % colors.length]}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}

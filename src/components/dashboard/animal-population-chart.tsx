"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/src/components/ui/chart"
import type { Animal } from "@/src/app/[userId]/[labId]/dashboard/types"
import { useMemo } from "react"

// Функция для группировки животных по дате и типу
function processAnimalData(animals: Animal[]): { chartData: any[], animalTypes: string[] } {
  if (!animals || animals.length === 0) {
    return { chartData: [], animalTypes: [] }
  }

  // Получаем дату 30 дней назад
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  // Фильтруем животных только за последние 30 дней
  const recentAnimals = animals.filter(animal => {
    const acquisitionDate = new Date(animal.acquisitionDate)
    return acquisitionDate >= thirtyDaysAgo
  })

  if (recentAnimals.length === 0) {
    return { chartData: [], animalTypes: [] }
  }

  // Группируем животных по дате поступления
  const animalsByDate = recentAnimals.reduce((acc, animal) => {
    const date = new Date(animal.acquisitionDate)
    const dateKey = date.toISOString().split('T')[0] // YYYY-MM-DD format
    
    if (!acc[dateKey]) {
      acc[dateKey] = {}
    }
    
    const animalType = animal.animalType.name
    if (!acc[dateKey][animalType]) {
      acc[dateKey][animalType] = 0
    }
    
    acc[dateKey][animalType]++
    return acc
  }, {} as Record<string, Record<string, number>>)

  // Получаем все уникальные типы животных
  const allAnimalTypes = Array.from(new Set(recentAnimals.map(a => a.animalType.name)))
  
  // Создаем массив всех дат за последние 30 дней
  const dateRange = []
  for (let i = 29; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    dateRange.push(date.toISOString().split('T')[0])
  }
  
  // Преобразуем в формат для графика, включая дни без данных
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

// Цветовая палитра для разных типов животных
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

export function AnimalPopulationChart({animals}: {animals: Animal[]}) {
  const { chartData, animalTypes } = useMemo(() => processAnimalData(animals), [animals])

  if (!chartData || chartData.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center text-muted-foreground">
        No data to render!
      </div>
    )
  }

  // Создаем конфигурацию для каждого типа животных
  const config = animalTypes.reduce((acc: Record<string, { label: string; color: string }>, type: string, index: number) => {
    acc[type] = {
      label: type,
      color: colors[index % colors.length],
    }
    return acc
  }, {} as Record<string, { label: string; color: string }>)

  return (
    <ChartContainer
      config={config}
      className="h-[300px]"
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

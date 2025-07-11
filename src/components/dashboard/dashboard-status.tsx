import type { Animal, Experiment, Task } from "@/src/app/[userId]/[labId]/dashboard/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Beaker, MousePointer, ClipboardList, AlertTriangle } from "lucide-react"

interface DashboardStatusProps {
  experiments: Experiment[];
  animals: Animal[];
  tasks: Task[];
  previousMonthData?: {
    experiments: number;
    animals: number;
    tasks: number;
  };
}

// Функция для расчета процента изменения
function calculatePercentageChange(current: number, previous: number): { 
  percentage: number; 
  isPositive: boolean; 
  isZero: boolean;
} {
  if (previous === 0) {
    return { 
      percentage: current > 0 ? 100 : 0, 
      isPositive: current > 0, 
      isZero: current === 0 
    };
  }
  
  const percentage = ((current - previous) / previous) * 100;
  return { 
    percentage: Math.abs(percentage), 
    isPositive: percentage >= 0, 
    isZero: percentage === 0 
  };
}

// Функция для форматирования текста статистики
function formatPercentageText(current: number, previous: number, type: 'animals' | 'experiments' | 'tasks'): { 
  text: string; 
  className: string 
} {
  if (type === 'animals') {
    // Для животных показываем проценты
    const { percentage, isPositive, isZero } = calculatePercentageChange(current, previous);
    
    if (isZero) {
      return { 
        text: "No change from last month", 
        className: "text-xs text-gray-500" 
      };
    }
    
    // Ограничиваем максимальный процент для более понятного отображения
    if (percentage > 500) {
      const diff = current - previous;
      const sign = diff > 0 ? "+" : "";
      const color = diff > 0 ? "text-green-600" : "text-red-600";
      
      return { 
        text: `${sign}${diff} new this month`, 
        className: `text-xs ${color}` 
      };
    }
    
    const sign = isPositive ? "+" : "-";
    const color = isPositive ? "text-green-600" : "text-red-600";
    
    return { 
      text: `${sign}${percentage.toFixed(1)}% from last month`, 
      className: `text-xs ${color}` 
    };
  } else if (type === 'experiments') {
    // Для экспериментов показываем абсолютные числа
    const diff = current - previous;
    
    if (diff === 0) {
      return { 
        text: "No change from last week", 
        className: "text-xs text-gray-500" 
      };
    }
    
    const sign = diff > 0 ? "+" : "";
    const color = diff > 0 ? "text-green-600" : "text-red-600";
    
    return { 
      text: `${sign}${diff} new this week`, 
      className: `text-xs ${color}` 
    };
  } else if (type === 'tasks') {
    // Для задач показываем количество на сегодня
    if (current === 0) {
      return { 
        text: "No task today", 
        className: "text-xs text-gray-500" 
      };
    }
    
    return { 
      text: `${current} due today`, 
      className: "text-xs text-blue-600" 
    };
  }
  
  return { 
    text: "No data", 
    className: "text-xs text-gray-500" 
  };
}

export function DashboardStatus({animals, experiments, tasks, previousMonthData}: DashboardStatusProps) {
  // Получаем форматированный текст для каждой статистики
  const animalsChange = previousMonthData ?
    formatPercentageText(animals.length, previousMonthData.animals, 'animals') : 
    { text: "No previous data", className: "text-xs text-gray-500" };
    
  const experimentsChange = previousMonthData ? 
    formatPercentageText(experiments.length, previousMonthData.experiments, 'experiments') : 
    { text: "No previous data", className: "text-xs text-gray-500" };
    
  const tasksChange = previousMonthData ? 
    formatPercentageText(tasks.length, previousMonthData.tasks, 'tasks') : 
    { text: "No previous data", className: "text-xs text-gray-500" };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Animals</CardTitle>
          <MousePointer className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{animals.length}</div>
          <p className={animalsChange.className}>{animalsChange.text}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Experiments</CardTitle>
          <Beaker className="h-4 w-4 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{experiments.length}</div>
          <p className={experimentsChange.className}>{experimentsChange.text}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
          <ClipboardList className="h-4 w-4 text-yellow-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{tasks.length}</div>
          <p className={tasksChange.className}>{tasksChange.text}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Critical Alerts</CardTitle>
          <AlertTriangle className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">3</div>
          <p className="text-xs text-gray-500">Requires immediate attention</p>
        </CardContent>
      </Card>
    </div>
  )
}

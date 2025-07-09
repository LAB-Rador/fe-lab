import DashboardView from "./deshboard.view";
import type { DashboardContainerProps } from "./types";

const DashboardContainer = ({animals, experiments, tasks, previousMonthData}: DashboardContainerProps) => {
    // Если данных предыдущего месяца нет, можно создать моковые данные для демонстрации
    const mockPreviousMonthData = previousMonthData || {
        animals: Math.floor(animals.length * 0.88), // -12% для демонстрации роста
        experiments: Math.max(0, experiments - 2),   // -2 эксперимента
        tasks: Math.max(0, tasks - 5)               // -5 задач
    };

    return (
        <DashboardView 
            experiments={experiments}
            animals={animals}
            tasks={tasks}
            previousMonthData={mockPreviousMonthData}
        />
    )
}

export default DashboardContainer;

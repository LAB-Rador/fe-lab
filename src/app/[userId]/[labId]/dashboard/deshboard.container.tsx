"use client"

import { useState } from "react";
import DashboardView from "./deshboard.view";
import type { Animal, DashboardContainerProps, Experiment, Task } from "./types";

const DashboardContainer = ({animals, experiments, tasks}: DashboardContainerProps) => {
    const [animalsData, setAnimalsData] = useState<Animal[] | []>(animals);
    const [experimentsData, setExperimentsData] = useState<Experiment[] | []>(experiments);
    const [tasksData, setTasksData] = useState<Task[] | []>(tasks);

    const now = new Date();

    const previousMonthData = {
        animals: animalsData.filter(animal => {
            if (!animal?.acquisitionDate) return false;
            const acquisitionDate = new Date(animal.acquisitionDate);
            if (isNaN(acquisitionDate.getTime())) return false;
            
            const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            const prevMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
            
            return acquisitionDate >= prevMonth && acquisitionDate <= prevMonthEnd;
        }).length,
        
        experiments: experimentsData.filter(experiment => {
            if (!experiment?.startDate) return false;
            const startDate = new Date(experiment.startDate);
            if (isNaN(startDate.getTime())) return false;
            
            const prevWeekStart = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
            const prevWeekEnd = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            
            return startDate >= prevWeekStart && startDate <= prevWeekEnd;
        }).length,
        
        tasks: tasksData.filter(task => {
            if (!task?.dueDate) return false;
            const dueDate = new Date(task.dueDate);
            if (isNaN(dueDate.getTime())) return false;
            
            const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
            
            return dueDate.toDateString() === yesterday.toDateString();
        }).length
    };

    return (
        <DashboardView 
            previousMonthData={previousMonthData}
            experiments={experimentsData}
            animals={animalsData}
            tasks={tasksData}
        />
    )
}

export default DashboardContainer;

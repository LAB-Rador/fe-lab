"use client"

import type { DashboardContainerProps, Experiment, Task, UpcomingEvent } from "./types";
import DashboardView from "./deshboard.view";
import { useMemo, useState } from "react";

const weekMs = 7 * 24 * 60 * 60 * 1000;

function inNextSevenDays(value: string | null | undefined, start: Date, end: Date) {
    if (!value) return false;
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return false;
    return date >= start && date < end;
}

function upcomingEventsFrom(experiments: Experiment[], tasks: Task[]): UpcomingEvent[] {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date(start.getTime() + weekMs);
    const events: UpcomingEvent[] = [];

    for (const experiment of experiments) {
        if (experiment.status === "COMPLETED" || experiment.status === "CANCELLED") continue;
        if (!inNextSevenDays(experiment.startDate, start, end)) continue;
        events.push({
            id: `experiment-${experiment.id}`,
            title: experiment.title,
            type: "experiment",
            date: experiment.startDate,
        });
    }

    for (const task of tasks) {
        if (!inNextSevenDays(task.dueDate, start, end)) continue;
        events.push({
            id: `task-${task.id}`,
            title: task.title,
            type: "task",
            date: task.dueDate,
        });
    }

    return events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

const DashboardContainer = ({animalSummary, experiments, tasks, notifications, laboratorySubscription}: DashboardContainerProps) => {
    const [experimentsData, setExperimentsData] = useState<Experiment[] | []>(experiments);
    const [tasksData, setTasksData] = useState<Task[] | []>(tasks);

    const now = new Date();

    const previousMonthData = useMemo(() => {
            return {
            animals: animalSummary.acquiredPreviousMonth,
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
        }
    }, [animalSummary.acquiredPreviousMonth, experimentsData, tasksData, now]);

    const upcomingEvents = upcomingEventsFrom(experimentsData, tasksData);

    return (
        <DashboardView 
            previousMonthData={previousMonthData}
            laboratorySubscription={laboratorySubscription}
            notifications={notifications}
            upcomingEvents={upcomingEvents}
            experiments={experimentsData}
            animalSummary={animalSummary}
            tasks={tasksData}
        />
    )
}

export default DashboardContainer;

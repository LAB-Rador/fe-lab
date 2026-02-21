"use client"
import { ExperimentView } from "./experiment.view";
import { Experiment } from "../types";
import { useCallback, useState } from "react";

interface ExperimentContainerProps {
  experiment: Experiment;
  experimentId: string;
  labId: string;
}

export const ExperimentContainer = (props: ExperimentContainerProps) => {
  const { experiment, experimentId, labId } = props;
  const [experimentData, setExperimentData] = useState<Experiment>(experiment);

  const calculateProgress = useCallback((startDate?: string, endDate?: string): number => {
    if (!startDate) return 0;
    const now = Date.now();
    const start = new Date(startDate).getTime();
    if (now < start) return 0;
    if (!endDate) return 100;
    const end = new Date(endDate).getTime();
    if (now >= end) return 100;
    return Math.round(((now - start) / (end - start)) * 100);
}, [])

  return (
    <ExperimentView
      calculateProgress={calculateProgress}
      experiment={experimentData}
      experimentId={experimentId}
      labId={labId}
    />
  )
}
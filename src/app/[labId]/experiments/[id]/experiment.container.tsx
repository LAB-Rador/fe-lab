"use client"
import { ExperimentView } from "./experiment.view";
import { Experiment } from "../types";
import { useState } from "react";

interface ExperimentContainerProps {
  experiment: Experiment;
  experimentId: string;
  labId: string;
}

export const ExperimentContainer = (props: ExperimentContainerProps) => {
  const { experiment, experimentId, labId } = props;
  const [experimentData, setExperimentData] = useState<Experiment>(experiment);



  return (
    <ExperimentView
      experiment={experimentData}
      experimentId={experimentId}
      labId={labId}
    />
  )
}
import DashboardView from "./deshboard.view";
import type { DashboardContainerProps } from "./types";

const DashboardContainer = ({animals, experiments, tasks}: DashboardContainerProps) => {
    return (
        <DashboardView 
            experiments={experiments}
            animals={animals}
            tasks={tasks}
        />
    )
}

export default DashboardContainer;

"use client"
import { ExperimentView } from "./experiment.view";
import type { Experiment } from "../types";
import type { InitialMembersTypes } from "../../team/types";
import { apiClient } from "@/src/lib/apiClient";
import { useState, useCallback } from "react";
import { toast } from "sonner";

interface ExperimentContainerProps {
  experiment: Experiment;
  experimentId: string;
  labId: string;
  userId: string;
  labMembers: InitialMembersTypes[];
}

export const ExperimentContainer = (props: ExperimentContainerProps) => {
  const { experiment, experimentId, labId, userId, labMembers } = props;
  const [experimentData, setExperimentData] = useState<Experiment>(experiment);

  const handleAddMember = useCallback(
    async (targetUserId: string) => {
      try {
        const response = await apiClient.post(
          `/api/experiments/${userId}/${labId}/${experimentId}/members`,
          { targetUserId },
        );
        if (response?.success && response.data) {
          setExperimentData((prev) => ({
            ...prev,
            members: [...(prev.members ?? []), response.data],
          }));
          toast.success("Member added");
        } else {
          toast.error(response?.message ?? "Failed to add member");
        }
      } catch {
        toast.error("Failed to add member");
      }
    },
    [userId, labId, experimentId],
  );

  const handleRemoveMember = useCallback(
    async (targetUserId: string) => {
      try {
        const response = await apiClient.delete(
          `/api/experiments/${userId}/${labId}/${experimentId}/members/${targetUserId}`,
        );
        if (response?.success) {
          setExperimentData((prev) => ({
            ...prev,
            members: (prev.members ?? []).filter((m) => m.userId !== targetUserId),
          }));
          toast.success("Member removed");
        } else {
          toast.error(response?.message ?? "Failed to remove member");
        }
      } catch {
        toast.error("Failed to remove member");
      }
    },
    [userId, labId, experimentId],
  );

  return (
    <ExperimentView
      experiment={experimentData}
      labId={labId}
      userId={userId}
      labMembers={labMembers}
      onAddMember={handleAddMember}
      onRemoveMember={handleRemoveMember}
    />
  );
};

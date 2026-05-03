import type { ExperimentAnimalRecordRow } from "@/src/app/[labId]/experiments/types"
import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

/**
 * Rows created on the client before the experiment page RSC cache refreshes.
 * Merged in ExperimentContainer with SSR `initialAnimalRecords` (no duplicate ids).
 */
export type ExperimentRecordsState = {
  prependedByExperimentId: Record<string, ExperimentAnimalRecordRow[]>
}

const initialState: ExperimentRecordsState = {
  prependedByExperimentId: {},
}

const experimentRecordsSlice = createSlice({
  name: "experimentRecords",
  initialState,
  reducers: {
    prependExperimentRecord(
      state,
      action: PayloadAction<{ experimentId: string; record: ExperimentAnimalRecordRow }>,
    ) {
      const { experimentId, record } = action.payload
      const current = state.prependedByExperimentId[experimentId] ?? []
      if (current.some((r) => r.id === record.id)) return
      state.prependedByExperimentId[experimentId] = [record, ...current]
    },
  },
})

export const { prependExperimentRecord } = experimentRecordsSlice.actions
export default experimentRecordsSlice.reducer

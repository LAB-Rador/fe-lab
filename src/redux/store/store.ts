import experimentRecordsReducer from "../slices/experimentRecordsSlice"
import notificationsReducer from "../slices/notificationsSlice"
import laboratoryReducer from "../slices/laboratorySlice"
import { configureStore } from "@reduxjs/toolkit"
import userReducer from "../slices/userSlice"

export const store = configureStore({
  reducer: {
    user: userReducer,
    laboratory: laboratoryReducer,
    notifications: notificationsReducer,
    experimentRecords: experimentRecordsReducer,
  },
})

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

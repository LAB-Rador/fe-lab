import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../slices/userSlice";
import laboratoryReducer from "../slices/laboratorySlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    laboratory: laboratoryReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

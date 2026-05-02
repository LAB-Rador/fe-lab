import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

/** Synced from lab layout (server) + updates when user reads notifications on Tasks. */
export type NotificationsState = {
  unreadCount: number
}

const initialState: NotificationsState = {
  unreadCount: 0,
}

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    /** Full replace — e.g. after loading the list from API. */
    setUnreadCount(state, action: PayloadAction<number>) {
      state.unreadCount = Math.max(0, Math.floor(action.payload))
    },
    /** One notification marked as read. */
    decreaseUnread(state, action: PayloadAction<number>) {
      const n = Math.max(0, Math.floor(action.payload))
      state.unreadCount = Math.max(0, state.unreadCount - n)
    },
  },
})

export const { setUnreadCount, decreaseUnread } = notificationsSlice.actions
export default notificationsSlice.reducer

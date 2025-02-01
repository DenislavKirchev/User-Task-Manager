import { configureStore } from "@reduxjs/toolkit"
import usersReducer from "./usersSlice"
import postsReducer from "./postsSlice"
import tasksReducer from "./tasksSlice"

export const store = configureStore({
  reducer: {
    users: usersReducer,
    posts: postsReducer,
    tasks: tasksReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

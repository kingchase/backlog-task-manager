import { configureStore } from "@reduxjs/toolkit";
import taskReducer from '../components/Dashboard/taskSlice'
import taskTableReducer from "../components/Dashboard/TaskTable/taskTableSlice"

export const store = configureStore({
    reducer: {
        task: taskReducer,
        taskTable: taskTableReducer
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
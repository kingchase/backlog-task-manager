import { configureStore } from "@reduxjs/toolkit";
import taskReducer from '../components/Dashboard/taskSlice'
import taskTableReducer from "../components/Dashboard/TaskTable/taskTableSlice"
import tableInputReducer from "../components/Dashboard/TaskTable/tableInputSlice"

export const store = configureStore({
    reducer: {
        task: taskReducer,
        taskTable: taskTableReducer,
        tableInput: tableInputReducer

    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
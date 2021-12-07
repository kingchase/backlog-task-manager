import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type {taskState} from "../taskSlice"
import type { RootState } from "../../../redux/store"

interface taskTableState {
    tasks: taskState[],
}

const initialState: taskTableState = {
    tasks: []
}

export const taskTableSlice = createSlice({
    name: 'taskTable',
    initialState,
    reducers: {
        createRow: (state, action: PayloadAction<taskState>) => {
            state.tasks.push(action.payload);
        },
        removeRow: (state, action: PayloadAction<number>) => {  // remove row by index
            if (action.payload > -1 && action.payload < state.tasks.length) {
                state.tasks.splice(action.payload, 1);
            }
        },
        clearTable: (state) => {
            state.tasks = [];
        },
        sortTableAZ: (state) => {
            state.tasks.sort((a, b) => (a.task_name > b.task_name)?1:-1);
        },
        sortTableGreaterTime: (state) => {
            state.tasks.sort((a, b) => (a.time_estimate > b.time_estimate)?1:-1);
        },
        sortTableLessTime: (state) => {
            state.tasks.sort((a, b) => (a.time_estimate < b.time_estimate)?1:-1);
        },
        sortTableExpiringSoonest: (state) => {
            state.tasks.sort((a,b) => (a.expiration_date > b.expiration_date)?1:-1);
        }
    }
})

export const { createRow, removeRow, clearTable, sortTableAZ, sortTableExpiringSoonest, sortTableGreaterTime, sortTableLessTime } = taskTableSlice.actions;
export const selectTask = (state: RootState) => state.taskTable;
export default taskTableSlice.reducer;
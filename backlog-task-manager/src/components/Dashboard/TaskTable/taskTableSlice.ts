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
        }
    }
})

export const { createRow, removeRow } = taskTableSlice.actions;
export const selectTask = (state: RootState) => state.taskTable;
export default taskTableSlice.reducer;
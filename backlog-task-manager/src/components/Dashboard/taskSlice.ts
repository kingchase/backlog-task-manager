import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from '../../redux/store'

interface taskState {
    task_id: number,
    user_id?: string,   // not sure if needed
    task_name: string,
    categories: string[],
    time_estimate: number,
    expiration_date: Date
}

const initialState: taskState = {
    task_id: -1,
    task_name: "N/A",
    categories: [],
    time_estimate: -1,
    expiration_date: new Date(Date.now())
}

export const taskSlice = createSlice({
    name: 'task',
    initialState,
    reducers: {
        changeName: (state, action: PayloadAction<string>) => {
            state.task_name = action.payload;
        },
        addCategory: (state, action: PayloadAction<string>) => {
            state.categories.push(action.payload);
        },
        removeCategory: (state, action: PayloadAction<string>) => {
            const index = state.categories.indexOf(action.payload);
            if (index > -1) state.categories.splice(index, 1);  // remove entry at index
        },
        changeTimeEstimate: (state, action: PayloadAction<number>) => {
            state.time_estimate = action.payload;
        },
        changeExpirationDate: (state, action: PayloadAction<Date>) => {
            state.expiration_date = action.payload;
        }
    }
})

export type {taskState};
export const {changeName, addCategory, removeCategory, changeTimeEstimate, changeExpirationDate} = taskSlice.actions;
export const selectTask = (state: RootState) => state.task
export default taskSlice.reducer;
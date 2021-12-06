import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../../redux/store"

interface tableInputState {
    inputs: string[]
}

const initialState: tableInputState = {
    inputs: ["","","",""]
}

export const tableInputSlice = createSlice({
    name: "tableInput",
    initialState,
    reducers: {
        updateByIndex: (state, action: PayloadAction<{data: string, index: number}>) => {
            state.inputs[action.payload.index] = action.payload.data;
        }
    }
})

export const {updateByIndex} = tableInputSlice.actions;
export const selectTableInput = (state: RootState) => state.tableInput.inputs;
export default tableInputSlice.reducer;
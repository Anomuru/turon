import {createSlice} from "@reduxjs/toolkit";
import { fetchQuarterMasterData } from "./quarterMasterThunk";

const initialState = {
    quarterMasters: [],
    loading: false,
    error: null
}

export const quarterMasterSlice = createSlice({
    name: "quarterMasterSlice",
    initialState,
    reducers: {
        updateLoading: (state) => {
            state.loading = true
        },
        updateQuarter: (state, action) => {
            state.loading = false
            state.quarterMasters = state.quarterMasters.map(item => {
                if (item.id === action.payload.id) {
                    return action.payload
                } else return item
            })
        },
        deleteQuarter: (state, action) => {
            state.loading = false
            state.quarterMasters = state.quarterMasters.filter(item => item.id !== action.payload)
        }
    },
    extraReducers: builder =>
        builder
            .addCase(fetchQuarterMasterData.pending, (state, action) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchQuarterMasterData.fulfilled, (state, action) => {
                state.quarterMasters = action.payload
                state.loading = false
                state.error = null
            })
            .addCase(fetchQuarterMasterData.rejected, (state) => {
                state.error = "error"
                state.loading = false
            })
})

export const {reducer: quarterMasterReducer, actions: quarterMasterActions} = quarterMasterSlice

export const {
    updateLoading,
    updateQuarter,
    deleteQuarter

} = quarterMasterActions
export default quarterMasterSlice.reducer
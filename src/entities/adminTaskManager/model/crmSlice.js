import {createSlice} from "@reduxjs/toolkit";
import {GetCallsHistoryThunk} from "entities/adminTaskManager/model/crmThunks.js";

const initialState = {
    history: [],
    loading: false,
    error: null

}

const crmSlice = createSlice({
    name: "crmSlice",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(GetCallsHistoryThunk.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(GetCallsHistoryThunk.fulfilled, (state, action) => {
                state.loading = false
                state.history = action.payload
                state.error = null
            })
            .addCase(GetCallsHistoryThunk.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
    }
})


export const {reducer: crmReducer} = crmSlice
import {createSlice} from "@reduxjs/toolkit";
import {vacancyWorkerListThunk} from "./vacancyWorkerListThunk";

const initialState = {
    workerData: [],
    loading: false,
    error: null
};


export const vacancyWorkerSlice = createSlice({
    name: "vacancyWorkerSlice",
    initialState,
    reducers: {},
    extraReducers: builder =>
    {
        builder
            .addCase(vacancyWorkerListThunk.pending, (state) => {
                state.loading = true
            })
            .addCase(vacancyWorkerListThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null
                state.workerData = action.payload

            })
            .addCase(vacancyWorkerListThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message
            })
    }
})

export default vacancyWorkerSlice.reducer
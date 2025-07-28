import {createSlice} from "@reduxjs/toolkit";
import {vacancyWorkerGetThunk} from "./vacancyWorkerGetThunk";


const initialState = {
    workerData: [],
    loading: false,
    error: null
}

export const vacancyWorkerSoucre = createSlice({
    name: "vacancyWorkerSoucre",
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(vacancyWorkerGetThunk.pending, (state) => {state.loading = true})
            .addCase(vacancyWorkerGetThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null
                state.workerData = action.payload;
            })
            .addCase(vacancyWorkerGetThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message
            })
    }

})

export default vacancyWorkerSoucre.reducer
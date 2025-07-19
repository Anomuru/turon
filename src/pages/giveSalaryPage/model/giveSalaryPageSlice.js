import {createSlice} from "@reduxjs/toolkit";
import {fetchEmployerSalaryThunk} from "./giveSalaryPageThunk";

const initialState = {
    salaryInsideData: [],
    loading: false,
    error: null
}

export const giveEmployerSalarySlice = createSlice({
    name: "giveEmployerSalarySlice",
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchEmployerSalaryThunk.pending, (state) => {
                state.loading = true
            })
            .addCase(fetchEmployerSalaryThunk.fulfilled, (state, action) => {
                state.loading = false
                state.salaryInsideData = action.payload
            })
            .addCase(fetchEmployerSalaryThunk.rejected, (state, action) =>{
                state.error = action.error.message
                state.loading = false
            })
    }
})

export default giveEmployerSalarySlice.reducer
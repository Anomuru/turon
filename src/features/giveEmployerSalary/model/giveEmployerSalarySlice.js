import {createSlice} from "@reduxjs/toolkit";
import {giveEmployerSalaryThunk} from "./giveEmployerSalaryThunk";

const  initialState = {
    salaries: [],
    loading: false,
    error: null
}

const giveEmployerSalarySlices = createSlice({
    name: "giveEmployerSalarySlice",
    initialState,
    reducers: {
        addSalary: (state, action) => {
            state.salaries.push(action.payload)
        },
    },
    extraReducers: builder => {
        builder
            .addCase(giveEmployerSalaryThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(giveEmployerSalaryThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.salaries.push(action.payload);
            })
            .addCase(giveEmployerSalaryThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = "error"
        })
    }
})

export const {addSalary} = giveEmployerSalarySlices.actions

export default giveEmployerSalarySlices.reducer;
import {createSlice} from "@reduxjs/toolkit";
import {employerSalaryDeleteThunk} from "./employerSalaryDeleteThunk";

const initialState = {
    salaries: [],
    loading: false,
    error: null,
}

const employerSalaryDeleteSlice = createSlice({
    name: 'employerSalaryDeleteSlice',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(employerSalaryDeleteThunk.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(employerSalaryDeleteThunk.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.salaries = state.salaries.filter(salary => salary.id !== action.payload);
            })
            .addCase(employerSalaryDeleteThunk.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    }
})

export default employerSalaryDeleteSlice.reducer
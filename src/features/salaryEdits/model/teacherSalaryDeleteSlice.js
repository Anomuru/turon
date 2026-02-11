import {createSlice} from "@reduxjs/toolkit";
import {teacherSalaryDeleteThunk} from "./teacherSalaryDeleteThunk";

const initialState = {
    salaries: [],
    loading: false,
    error: null,
}

const teacherSalaryDeleteSlice = createSlice({
    name: 'teacherSalaryDeleteSlice',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(teacherSalaryDeleteThunk.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(teacherSalaryDeleteThunk.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.salaries = state.salaries.filter(salary => salary.id !== action.payload);
            })
            .addCase(teacherSalaryDeleteThunk.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    }
})

export default teacherSalaryDeleteSlice.reducer
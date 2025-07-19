import {createSlice} from "@reduxjs/toolkit";
import {giveTeacherSalaryThunk} from "./giveTeacherSalaryThunk";

const initialState = {
    salaries: [],
    loading: false,
    error: null
}

const giveTeacherSalarySlices = createSlice({
    name: "giveTeacherSalarySlices",
    initialState,
    reducers: {
        addSalary: (state, action) => {
            state.salaries.push(action.payload);
        },
    },
    extraReducers: builder => {
        builder
            .addCase(giveTeacherSalaryThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(giveTeacherSalaryThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.salaries.push(action.payload);
            })
            .addCase(giveTeacherSalaryThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});


export const {addSalary} = giveTeacherSalarySlices.actions;

export default giveTeacherSalarySlices.reducer;

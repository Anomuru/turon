import {createSlice} from "@reduxjs/toolkit";
import {fetchTeacherStatistics} from "./teacherStatisticsThunk.js";

const initialState = {
    data: null,
    loading: false,
    error: null
};

export const teacherStatisticsSlice = createSlice({
    name: "teacherStatisticsSlice",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTeacherStatistics.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTeacherStatistics.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchTeacherStatistics.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
});

export const teacherStatisticsReducer = teacherStatisticsSlice.reducer;

import {createSlice} from "@reduxjs/toolkit";
import {fetchLessonPlanDailyReport} from "./lessonPlanDailyReportThunk.js";

const initialState = {
    data: null,
    loading: false,
    error: null
};

export const lessonPlanDailyReportSlice = createSlice({
    name: "lessonPlanDailyReportSlice",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchLessonPlanDailyReport.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchLessonPlanDailyReport.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchLessonPlanDailyReport.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
});

export const lessonPlanDailyReportReducer = lessonPlanDailyReportSlice.reducer;

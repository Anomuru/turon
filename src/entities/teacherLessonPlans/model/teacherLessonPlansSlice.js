import {createSlice} from "@reduxjs/toolkit";
import {fetchTeacherLessonPlans} from "./teacherLessonPlansThunk.js";

const initialState = {
    lessonPlans: [],
    loading: false,
    error: null
};

export const teacherLessonPlansSlice = createSlice({
    name: "teacherLessonPlansSlice",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTeacherLessonPlans.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTeacherLessonPlans.fulfilled, (state, action) => {
                state.loading = false;
                state.lessonPlans = action.payload;
            })
            .addCase(fetchTeacherLessonPlans.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
});

export const teacherLessonPlansReducer = teacherLessonPlansSlice.reducer;

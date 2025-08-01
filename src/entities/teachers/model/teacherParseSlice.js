import { createSlice } from "@reduxjs/toolkit";
import {editTeacherThunk, fetchDropStudents, fetchTeacherId} from "./teacherParseThunk";

const initialState = {
    teacherId: [],
    students: [],
    studentsLoading: false,
    loading: false,
    error: null,
    fetchTeacherStatus: false

};

export const teacherParseSlice = createSlice({
    name: "teacherParseSlice",
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchTeacherId.pending, state => { state.fetchTeacherStatus = true })
            .addCase(fetchTeacherId.fulfilled, (state, action) => {
                state.fetchTeacherStatus = false;
                state.teacherId = action.payload;
            })
            .addCase(fetchTeacherId.rejected, state => { state.fetchTeacherStatus = false })
            .addCase(editTeacherThunk.pending, state => {
                state.fetchTeacherStatus = false;
                state.error = null;
            })
            .addCase(editTeacherThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.teacherId = {
                    ...state.teacherId,
                    ...action.payload
                };
            })
            .addCase(editTeacherThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            .addCase(fetchDropStudents.pending, state => {
                state.studentsLoading = true
                state.error = null
            })
            .addCase(fetchDropStudents.fulfilled, (state, action) => {
                state.students = action.payload
                state.studentsLoading = false
                state.error = null
            })
            .addCase(fetchDropStudents.rejected, state => {
                state.studentsLoading = false
                state.error = "error"
            })




    }
});

// export default teacherParseSlice.reducer;
export const {reducer: teacherParseReducer} = teacherParseSlice
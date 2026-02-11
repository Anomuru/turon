import { createSlice } from "@reduxjs/toolkit";
import {fetchGroupsAttendance} from "entities/teacherAttendance/model/teacherAttendanceThunk.js";



const initialState = {
    attendance: [],
    attendanceCount: null,
    loading: false,
    error: null
}

const teacherAttendanceSlice = createSlice({
    name: "teacherAttendanceSlice",
    initialState,
    reducers: {},
    extraReducers: builder =>
        builder
            .addCase(fetchGroupsAttendance.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchGroupsAttendance.fulfilled, (state, action) => {
                state.attendance = action.payload
                state.attendanceCount = action.payload?.overall_summary
                state.loading = false
                state.error = null
            })
            .addCase(fetchGroupsAttendance.rejected, (state) => {
                state.loading = false
                state.error = "error"
            })
})

export default teacherAttendanceSlice.reducer


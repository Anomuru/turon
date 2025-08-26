import {createSlice} from "@reduxjs/toolkit";
import {
    changeFlowProfile,
    fetchFilteredStudents,
    fetchFilteredTeachers,
    fetchFlowProfileData, fetchFlowProfileNextLesson
} from "./flowsProfileThunk";

const initialState = {
    data: null,
    nextLessonData: null,
    filteredStudents: null,
    filteredTeachers: null,
    loading: false,
    error: null,
    loadingTeacher: false,
    loadingProfile: false
}

const flowsProfileSlice = createSlice({
    name: "flowsProfileSlice",
    initialState,
    reducers: {


    },
    extraReducers: builder =>
        builder
            .addCase(fetchFlowProfileData.pending, (state) => {
                state.loadingProfile = true
                state.error = null
            })
            .addCase(fetchFlowProfileData.fulfilled, (state, action) => {
                state.data = action.payload
                state.loadingProfile = false
                state.error = null
            })
            .addCase(fetchFlowProfileData.rejected, (state) => {
                state.loadingProfile = false
                state.error = "error"
            })
            .addCase(fetchFlowProfileNextLesson.pending, (state) => {
                // state.loading = true
                // state.error = null
            })
            .addCase(fetchFlowProfileNextLesson.fulfilled, (state, action) => {
                state.nextLessonData = action.payload
                // state.loading = false
                // state.error = null
            })
            .addCase(fetchFlowProfileNextLesson.rejected, (state) => {
                // state.loading = false
                // state.error = null
            })
            .addCase(fetchFilteredStudents.pending, (state) => {
                // state.loading = true
                // state.error = null
            })
            .addCase(fetchFilteredStudents.fulfilled, (state, action) => {
                state.filteredStudents = action.payload?.classes
                // state.loading = false
                // state.error = null
            })
            .addCase(fetchFilteredStudents.rejected, (state) => {
                // state.loading = false
                // state.error = null
            })
            .addCase(fetchFilteredTeachers.pending, (state) => {
                state.loadingTeacher = true
                // state.error = null
            })
            .addCase(fetchFilteredTeachers.fulfilled, (state, action) => {
                state.filteredTeachers = action.payload?.teachers_list
                state.loadingTeacher = false
                // state.error = null
            })
            .addCase(fetchFilteredTeachers.rejected, (state) => {
                state.loadingTeacher = false
                // state.error = null
            })
            .addCase(changeFlowProfile.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(changeFlowProfile.fulfilled, (state, action) => {
                state.data = action.payload
                state.loading = false
                state.error = null
            })
            .addCase(changeFlowProfile.rejected, (state) => {
                state.loading = false
                state.error = "error"
            })
})

export default flowsProfileSlice.reducer
export const {reducer: flowsProfileReducer} = flowsProfileSlice


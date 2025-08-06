import {createSlice} from "@reduxjs/toolkit";

import {
    fetchClassColors,
    fetchClassNumberList,
    fetchFilteredStudents,
    fetchOnlyNewStudentsData,
    fetchOnlyStudyingStudentsData,
    fetchSchoolStudents,
    fetchOnlyDeletedStudentsData, fetchStudentsByClass, fetchDeletedNewStudentsThunk
} from "./studentsThunk";


const initialState = {
    filteredErrors: null,
    filteredStudents: [],
    filteredTeachers: [],
    filteredCurseTypes: [],
    filteredCurseLevel: [],
    schoolClassNumbers: [],
    schoolClassColors: [],
    schoolStudents: [],
    newStudentes: [],
    studyingStudents: [],
    deletedStudents: [],
    filteredByClassStudents: [],
    filteredByClass: "idle",
    newStudentsStatus: "idle",
    studyingStudentsStatus: false,
    loading: false,
    error: null
}

export const newStudents = createSlice({
    name: "newStudents",
    initialState,
    reducers: {
        getFilteredStudentsStatus: (state) => {
            state.newStudentsStatus = "loading"
        },
        getFilteredStudentsData: (state, action) => {
            state.filteredStudents = action.payload.subjects_with_students
            state.filteredTeachers = action.payload.teachers
            state.filteredErrors = action.payload.errors
            state.newStudentsStatus = "success"
        },
        getCurseTypes: (state, action) => {
            state.filteredCurseTypes = action.payload
        },
        getCurseLevel: (state, action) => {
            state.filteredCurseLevel = action.payload
        },
        stopFilteredStudentsLoading: (state) => {
            state.newStudentsStatus = "idle"
        },

        onDeleteNewStudents: (state,action) => {
            state.newStudentes = state.newStudentes.filter(item => item.id !== +action.payload)
        },

        onDeleteGroupStudentBack: (state,action) => {
            state.deletedStudents = state.deletedStudents.filter(item => item.student.id !== action.payload)
            console.log(action.payload, typeof action.payload, "log")
        }


    },
    extraReducers: builder =>
        builder
            .addCase(fetchOnlyNewStudentsData.pending, state => {
                state.studyingStudentsStatus = true
            })
            .addCase(fetchOnlyNewStudentsData.fulfilled, (state, action) => {
                state.newStudentes = action.payload
                state.studyingStudentsStatus = false
                state.loading = false
            })
            .addCase(fetchOnlyNewStudentsData.rejected, (state, action) => {
                state.studyingStudentsStatus = false
            })



            .addCase(fetchDeletedNewStudentsThunk.pending, state => {
                state.studyingStudentsStatus = true
            })
            .addCase(fetchDeletedNewStudentsThunk.fulfilled, (state, action) => {
                state.newStudentes = action.payload
                state.studyingStudentsStatus = false
            })
            .addCase(fetchDeletedNewStudentsThunk.rejected, (state, action) => {
                state.studyingStudentsStatus = false
            })



            .addCase(fetchStudentsByClass.pending, state => {
                state.filteredByClass = "loading"
            })
            .addCase(fetchStudentsByClass.fulfilled, (state, action) => {
                state.filteredByClassStudents = action.payload
                state.filteredByClass = "success"
            })
            .addCase(fetchStudentsByClass.rejected, (state, action) => {
                state.filteredByClass = "error"
            })



            .addCase(fetchOnlyStudyingStudentsData.pending, state => {
                state.studyingStudentsStatus = true
            })
            .addCase(fetchOnlyStudyingStudentsData.fulfilled, (state, action) => {
                state.studyingStudents = action.payload
                state.studyingStudentsStatus = false
            })
            .addCase(fetchOnlyStudyingStudentsData.rejected, (state, action) => {
                state.studyingStudentsStatus = false
            })



            .addCase(fetchOnlyDeletedStudentsData.pending, state => {
                state.studyingStudentsStatus = true
                state.error = null
            })
            .addCase(fetchOnlyDeletedStudentsData.fulfilled, (state, action) => {
                state.deletedStudents = action.payload
                state.studyingStudentsStatus = false
            })
            .addCase(fetchOnlyDeletedStudentsData.rejected, (state, action) => {
                state.error = action.error.message
                state.studyingStudentsStatus = false
            })



            .addCase(fetchFilteredStudents.pending, state => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchFilteredStudents.fulfilled, (state, action) => {
                state.filteredStudents = action.payload
                state.loading = false
                state.error = null
            })
            .addCase(fetchFilteredStudents.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload ?? null
            })



            .addCase(fetchClassNumberList.pending, state => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchClassNumberList.fulfilled, (state, action) => {
                state.schoolClassNumbers = action.payload
                state.loading = false
                state.error = null
            })
            .addCase(fetchClassNumberList.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload ?? null
            })



            .addCase(fetchClassColors.pending, state => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchClassColors.fulfilled, (state, action) => {
                state.schoolClassColors = action.payload
                state.loading = false
                state.error = null
            })
            .addCase(fetchClassColors.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload ?? null
            })



            .addCase(fetchSchoolStudents.pending, state => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchSchoolStudents.fulfilled, (state, action) => {
                state.schoolStudents = action.payload
                state.loading = false
                state.error = null
            })
            .addCase(fetchSchoolStudents.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload ?? null
            })
})

// export default studentsSlice.reducer
export const {reducer: studentsReducer} = newStudents
export const {
    getFilteredStudentsData,
    getFilteredStudentsStatus,
    getCurseTypes,
    getCurseLevel,
    stopFilteredStudentsLoading,
    onDeleteNewStudents,
    onDeleteGroupStudentBack
} = newStudents.actions

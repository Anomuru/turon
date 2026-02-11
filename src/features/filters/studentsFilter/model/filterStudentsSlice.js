import {createSlice} from "@reduxjs/toolkit";
import {fetchFilteredStudents} from "./filterStudentsThunk"

const initialState = {
    students: null,
    loading: false,
    error: null
}

export const filterStudentSlice = createSlice({
    name: "filterStudents",
    initialState,
    reducers: {},
    extraReducers: builder =>
        builder
            .addCase(fetchFilteredStudents.pending, state => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchFilteredStudents.fulfilled, (state, action) => {
                state.students = action.payload
                state.loading = false
                state.error = null
            })
            .addCase(fetchFilteredStudents.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload ?? null
            })

})

export default filterStudentSlice.reducer
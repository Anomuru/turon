import {createSlice} from "@reduxjs/toolkit";
import {getDeletedPayment, getStudentPayment} from "../thunk/student";

const initialState = {
    studentsData: [],
    loading: false,
    error: false,
    deletedStudentsPayment: []
}
const studentSlice = createSlice({
    name: "studentSlice",
    initialState,
    reducers: {
        onDeleteStudents: (state, action) => {
            state.studentsData = state.studentsData.filter(item => item.id !== action.payload.id)
        },
    },
    extraReducers: builder =>
        builder
            .addCase(getStudentPayment.pending , state => {
                state.loading = true
                state.error = false
            })
            .addCase(getStudentPayment.fulfilled ,(state, action) =>{
                state.studentsData = action.payload
                state.loading = false
                state.error = false
            } )
            .addCase(getStudentPayment.rejected , state => {
                state.error = true
                state.loading = false
            })
            .addCase(getDeletedPayment.pending , state => {
                state.loading = true
                state.error = false
            })
            .addCase(getDeletedPayment.fulfilled, (state, action) => {
                state.deletedStudentsPayment = action.payload
                state.loading = false
                state.error = false
            })
            .addCase(getDeletedPayment.rejected, state => {
                state.loading = false
                state.error = true
            })
})

export const {onDeleteStudents} = studentSlice.actions

export default studentSlice.reducer
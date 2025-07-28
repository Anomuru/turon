import {createSlice} from "@reduxjs/toolkit";
import {getAll, getEmployer, getStudentPayment, getTeacherSalary} from "../thunk/otchotAccountingThunk";


const initialState = {
    loading: false,
    error: false,
    years: [],
    months: [],
    students: [],
    teacherSalary: [],
    employerSalary: [],
    all: []
}


const accountingOtchotSlice = createSlice({
    name: "otchotSlice",
    initialState,
    reducers: {
        getFilteredAll: (state, action) => {
            state.all = action.payload
        }
    },
    extraReducers: builder =>
        builder
            .addCase(getStudentPayment.pending , state => {
                state.loading = true
                state.error = false
            })
            .addCase(getStudentPayment.fulfilled , (state, action) => {
                state.students =action.payload

                state.loading = false
                state.error= false
            })
            .addCase(getStudentPayment.rejected , state => {
                state.loading = false
                state.error = true
            })
            .addCase(getTeacherSalary.pending , state => {
                state.loading = true
                state.error = false
            })
            .addCase(getTeacherSalary.fulfilled , (state, action) => {
                state.teacherSalary =action.payload
                state.loading = false
                state.error= false
            })
            .addCase(getTeacherSalary.rejected , state => {
                state.loading = false
                state.error = true
            })


            .addCase(getEmployer.pending , state => {
                state.loading = true
                state.error = false
            })
            .addCase(getEmployer.fulfilled , (state, action) => {
                state.employerSalary =action.payload
                state.loading = false
                state.error= false
            })
            .addCase(getEmployer.rejected , state => {
                state.loading = false
                state.error = true
            })


            .addCase(getAll.pending , state => {
                state.loading = true
                state.error = false
            })
            .addCase(getAll.fulfilled , (state, action) => {
                state.all =action.payload
                console.log(action.payload , "keldi")
                state.loading = false
                state.error= false
            })
            .addCase(getAll.rejected , state => {
                state.loading = false
                state.error = true
            })
})

export const {getFilteredAll} = accountingOtchotSlice.actions
export default accountingOtchotSlice.reducer
import {createSlice} from "@reduxjs/toolkit";
import {changePaymentType, getDeletedTeacherSalary, getTeacherSalary} from "../thunk/teacherSalarythunk";


const initialState = {
    teacherSalary: [],
    loading: false,
    error: false,
    deletedSalary: []
}

const teacherSalary = createSlice({
    name: "teacherSalary",
    initialState,
    reducers: {
        onDeleteTeacherSalary: (state, action) => {
            state.teacherSalary = state.teacherSalary.filter(item => item.id !== action.payload.id)
        },
        onChangePayment: (state, action) => {
            state.teacherSalary.payment_types = state.teacherSalary.payment_types.map(item => {
                if (item.id === action.payload.id) {
                    return {...item, payment_types: action.payload.payment_types}
                }
                return item
            })
        }
    },
    extraReducers: builder =>
        builder
            // .addCase(changePaymentType.pending, state => {
            //     state.loading = true
            //     state.error = null
            // })
            // .addCase(changePaymentType.fulfilled, (state, action) => {
            //     state.teacherSalary = action.payload
            //     state.loading = false
            //     state.error = null
            // })
            // .addCase(changePaymentType.rejected, (state, action) => {
            //     state.loading = false
            //     state.error = action.payload ?? null
            // })
            .addCase(getTeacherSalary.pending, state => {
                state.loading = true
                state.error = false
            })
            .addCase(getTeacherSalary.fulfilled, (state, action) => {
                state.teacherSalary = action.payload
                state.loading = false
                state.error = false
            })
            .addCase(getTeacherSalary.rejected , state => {
                state.error = true
                state.loading = false
            })
            .addCase(getDeletedTeacherSalary.pending, state => {
                state.loading = true
                state.error = false
            })
            .addCase(getDeletedTeacherSalary.fulfilled, (state, action) => {
                state.deletedSalary = action.payload
                state.loading = false
                state.error = false
            })
            .addCase(getDeletedTeacherSalary.rejected , state => {
                state.error = true
                state.loading = false
            })
})

export const {onDeleteTeacherSalary, onChangePayment} = teacherSalary.actions
export default teacherSalary.reducer
import {createSlice} from "@reduxjs/toolkit";
import {getEmpSalary, getDeletedEmpSalary} from "../thunk/employerSalary";

const initialState = {
    loading: false,
    error: null,
    employerSalary: [],
    deletedEmployerSalary: []
}

const employerSlice = createSlice({
    name: "employerSlice",
    initialState,
    reducers: {
        onDeleteEmployerSalary: (state, action) => {
            state.employerSalary = state.employerSalary.filter(item => item.id !== action.payload.id)
        },
        changePaymentType: (state, action) => {

            console.log(action.payload, "action")
            state.employerSalary = state.employerSalary.map(item => {
                if (item.id === +action.payload.id) {
                    console.log(item.id, action.payload.id, " item")
                    return {
                        id: action.payload.id ,
                        payment_types: action.payload.payment_types,
                        user: action.payload.changingData.item.user,
                        user_salary: action.payload.changingData.item.user_salary
                    }
                }
                return item
            })
        },

    },
    extraReducers: builder =>
        builder
            .addCase(getEmpSalary.pending, state => {
                state.loading = true
                state.error = false
            })
            .addCase(getEmpSalary.fulfilled, (state, action) => {
                state.employerSalary = action.payload
                console.log(action.payload, "emp")
                state.loading = false
                state.error = false
            })
            .addCase(getEmpSalary.rejected, (state, action) => {
                state.loading = false
                state.error = true
            })
            .addCase(getDeletedEmpSalary.pending, state => {
                state.loading = true
                state.error = false
            })
            .addCase(getDeletedEmpSalary.fulfilled, (state, action) => {
                state.deletedEmployerSalary = action.payload
                state.loading = false
                state.error = false
            })
            .addCase(getDeletedEmpSalary.rejected, state => {
                state.error = true
                state.loading = false
            })

})

export const {onDeleteEmployerSalary, changePaymentType} = employerSlice.actions
export default employerSlice.reducer
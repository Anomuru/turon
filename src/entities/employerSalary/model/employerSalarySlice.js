import {createSlice} from "@reduxjs/toolkit";
import {fetchEmployerSalaryThunk} from "./employerSalaryThunk";


const initialState = {
    salaryData: [],
    loading: false,
    erroor: null
}


export const employerSalarySlice = createSlice({
    name: "teacherSalarySlice",
    initialState,
    reducers: {
        onEditSalary: (state, action) => {
            state.salaryData = state.salaryData.map(item => {
                if (item.id === action.payload.id) {
                    return action.payload.data
                }
                return item
            })
        }

    },
    extraReducers: builder => {
        builder
            .addCase(fetchEmployerSalaryThunk.pending, (state) => {
                state.loading = true
            })
            .addCase(fetchEmployerSalaryThunk.fulfilled, (state, action) => {
                state.loading = false
                state.salaryData = action.payload

            })
            .addCase(fetchEmployerSalaryThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message
            })
    }
})
export const {onEditSalary} = employerSalarySlice.actions

export default employerSalarySlice.reducer
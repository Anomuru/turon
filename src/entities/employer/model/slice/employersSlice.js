import {createSlice} from "@reduxjs/toolkit";
import {fetchEmployersData} from "./employersThunk";

const initialState = {
    employersData: [],
    DeletedEmployers: [],
    employerDataWithFilter: [],
    loading: false,
    error: null
}

export const employersSlice = createSlice({
    name: 'employersSlice',
    initialState,
    reducers: {
        onDeleteEmployer: (state, action) => {
            state.employersData = state.employersData.filter(employer => employer.id !== action.payload)
        }
    },
    extraReducers: builder => {
        builder
            .addCase(fetchEmployersData.pending, (state) => {state.loading = true})
            .addCase(fetchEmployersData.fulfilled, (state, action) => {
                state.loading = false
                state.employersData = action.payload
            })
            .addCase(fetchEmployersData.rejected, (state) => {
            state.loading = false;
            state.error = 'error';
        })





    }
})

export const {onDeleteEmployer} = employersSlice.actions
export const {reducer: employersReducer} = employersSlice

export default employersSlice.reducer
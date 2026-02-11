import {createSlice} from "@reduxjs/toolkit";
import {fetchEmployersData, fetchEmployersDataWithoutPagination} from "./employersThunk";

const initialState = {
    employersData: [],
    employersCount: 0,
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
            .addCase(fetchEmployersData.pending, (state) => {
                state.loading = true
            })
            .addCase(fetchEmployersData.fulfilled, (state, action) => {
                state.employersData = action.payload?.results ?? action.payload
                state.employersCount = action.payload?.count
                state.loading = false
            })
            .addCase(fetchEmployersData.rejected, (state) => {
                state.loading = false;
                state.error = 'error';
            })
            .addCase(fetchEmployersDataWithoutPagination.pending, (state) => {
                state.loading = true
            })
            .addCase(fetchEmployersDataWithoutPagination.fulfilled, (state, action) => {
                state.employersData = action.payload
                state.loading = false
            })
            .addCase(fetchEmployersDataWithoutPagination.rejected, (state) => {
                state.loading = false;
                state.error = 'error';
            })


    }
})

export const {onDeleteEmployer} = employersSlice.actions
export const {reducer: employersReducer} = employersSlice

export default employersSlice.reducer
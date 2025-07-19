import {createSlice} from "@reduxjs/toolkit";
import {fetchFilteredEmployees} from "./filterEmployeesThunk"

const initialState = {
    employees: null,
    ageTo: null,
    ageFrom: null,
    jobId: null,
    languageId: null,
    isDelete: false,
    loading: false,
    error: null
}

export const filterEmployeesSlices = createSlice({
    name: "filterEmployees",
    initialState,
    reducers: {
        fetchAgeTo: (state, action) => {
            state.ageTo = action.payload
        },
        fetchAgeFrom: (state, action) => {
            state.ageFrom = action.payload
        },
        fetchAgeJobId: (state, action) => {
            state.jobId = action.payload
        },
        fetchLanguageId: (state, action) => {
            state.languageId = action.payload
        },
        fetchIsDelete: (state, action) => {
            state.isDelete = action.payload
        }
    },
    extraReducers: builder =>
        builder
            .addCase(fetchFilteredEmployees.pending, state => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchFilteredEmployees.fulfilled, (state, action) => {
                state.employees = action.payload
                state.loading = false
                state.error = null
            })
            .addCase(fetchFilteredEmployees.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload ?? null
            })
})

export default filterEmployeesSlices.reducer
export const {
    fetchAgeTo,
    fetchAgeFrom,
    fetchAgeJobId,
    fetchLanguageId,
    fetchIsDelete
} = filterEmployeesSlices.actions

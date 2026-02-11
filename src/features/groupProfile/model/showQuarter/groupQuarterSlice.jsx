import {createSlice} from "@reduxjs/toolkit";
import {
    fetchAcademicData,
    fetchAcademicTerm,
    fetchAcademicYear
} from "features/groupProfile/model/showQuarter/groupQuarterThunk.jsx";

const initialState = {
    data : [],
    loading: false,
    error: false,
    academicYear: null,
    quarter: null
}

const groupQuarterShowSlice = createSlice({
    name: "groupQuarterShowSlice",
    initialState,
    reducers: {},
    extraReducers: builder => builder
        .addCase(fetchAcademicData.pending , state => {
            state.loading = true
            state.error = false
        })
        .addCase(fetchAcademicData.fulfilled , (state, action) => {
            state.data = action.payload
            state.loading = false
            state.error = false
        })
        .addCase(fetchAcademicData.rejected , state => {
            state.loading = false
            state.error = true
        })


        .addCase(fetchAcademicTerm.pending , state => {
            state.loading = true
            state.error = false
        })
        .addCase(fetchAcademicTerm.fulfilled , (state, action) => {
            state.quarter = action.payload
            state.loading = false
            state.error = false
        })
        .addCase(fetchAcademicTerm.rejected , state => {
            state.loading = false
            state.error = true
        })

        .addCase(fetchAcademicYear.pending , state => {
            state.loading = true
            state.error = false
        })
        .addCase(fetchAcademicYear.fulfilled , (state, action) => {
            state.academicYear = action.payload
            state.loading = false
            state.error = false
        })
        .addCase(fetchAcademicYear.rejected , state => {
            state.loading = false
            state.error = true
        })


})

export const {reducer: groupQuarterReducer} = groupQuarterShowSlice
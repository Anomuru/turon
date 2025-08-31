import {createSlice} from "@reduxjs/toolkit";

import {
    fetchTimeTableListData,
    createTimeTable,
    updateTimeTable
} from "../timeTableListThunk/timeTableListThunk";

const initialState = {
    data: [],
    dataCount: 0,
    loading: false,
    error: null
}

const TimeTableSlice = createSlice({
    name: "TimeTableSlice",
    initialState,
    reducers: {
        // changeTime: (state, action) => {
        //     state.data = [
        //         ...state.data.filter(item => item.id !== action.payload.id),
        //         action.payload
        //     ]
        //     state.loading = false
        //     state.error = null
        // }
        onDelete: (state , action) => {
            state.data= state.data.filter(item => item.id !== action.payload)

        }
    },
    extraReducers: builder =>
        builder
            .addCase(fetchTimeTableListData.pending, state => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchTimeTableListData.fulfilled, (state, action) => {
                state.dataCount = action.payload?.count
                state.data = action.payload?.results
                state.loading = false
                state.error = null
            })
            .addCase(fetchTimeTableListData.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload ?? null
            })
            .addCase(createTimeTable.pending, state => {
                state.loading = true
                state.error = null
            })
            .addCase(createTimeTable.fulfilled, (state, action) => {
                state.data = [...state.data, action.payload]
                state.loading = false
                state.error = null
            })
            .addCase(createTimeTable.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload ?? null
            })
            .addCase(updateTimeTable.pending, state => {
                state.loading = true
                state.error = null
            })
            .addCase(updateTimeTable.fulfilled, (state, action) => {
                state.data = [
                    ...state.data.filter(item => item.id !== action.payload.id),
                    action.payload
                ]
                state.loading = false
                state.error = null
            })
            .addCase(updateTimeTable.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload ?? null
            })
})

// export default TimeTableSlice.reducer

export const {reducer: timeTableReducer} = TimeTableSlice
export const {changeTime , onDelete} = TimeTableSlice.actions

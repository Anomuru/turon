import {createSlice} from "@reduxjs/toolkit";
import {
    fetchGroupObserve,
    fetchGroupObserveOption
} from "features/groupProfile/model/groupObserve/groupObserveThunk.js";


const initialState = {
    loading: false,
    observe: [],
    options: [],
    error: false,
}

const groupObserveSlice = createSlice({
    name: "groupObserveSlice",
    initialState,
    reducers: {},
    extraReducers: builder =>
        builder
            .addCase(fetchGroupObserve.pending , state => {
                state.loading = true
                state.error = false
            })
            .addCase(fetchGroupObserve.fulfilled , (state , action) => {
                state.loading = false
                state.error = false
                state.observe = action.payload
            })
            .addCase(fetchGroupObserve.rejected , state => {
                state.loading = false
                state.error = true
            })
            .addCase(fetchGroupObserveOption.pending , state => {
                state.loading = true
                state.error = false
            })
            .addCase(fetchGroupObserveOption.fulfilled , (state , action) => {
                state.loading = false
                state.error = false
                state.options = action.payload
            })
            .addCase(fetchGroupObserveOption.rejected , state => {
                state.loading = false
                state.error = true
            })
})
export const {reducer: groupObserveReducer} = groupObserveSlice
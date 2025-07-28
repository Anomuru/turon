import {createSlice} from "@reduxjs/toolkit";

import {fetchRgbData} from "./rgbDataThunk";

const initialState = {
    data: [],
    loading: false,
    error: null
}

const rgbSlice = createSlice({
    name: "rgbSlice",
    initialState,
    reducers: {},
    extraReducers: builder =>
        builder
            .addCase(fetchRgbData.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchRgbData.fulfilled, (state, action) => {
                state.data = action.payload
                state.loading = false
                state.error = null
            })
            .addCase(fetchRgbData.rejected, (state) => {
                state.loading = false
                state.error = "error"
            })
})

export default rgbSlice.reducer

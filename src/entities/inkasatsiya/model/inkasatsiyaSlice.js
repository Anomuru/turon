import {createSlice} from "@reduxjs/toolkit";
import {inkasatsiyaThunk} from "./inkasatsiyaThunk";

const initialState = {
    loading: false,
    error: false,
    inkasatsiya: []
}

const inkasatsiyaSlice = createSlice({
    name: "inkasatsiyaSlice",
    initialState,
    reducers: {},
    extraReducers: builder =>
        builder
            .addCase(inkasatsiyaThunk.pending, state => {
                state.loading = true
                state.error = false
            })
            .addCase(inkasatsiyaThunk.fulfilled, (state, action) => {
                state.error = false
                state.loading = false
                state.inkasatsiya = action.payload
            })
            .addCase(inkasatsiyaThunk.rejected, state => {
                state.error = true
                state.loading = false
            })
})

export default inkasatsiyaSlice.reducer
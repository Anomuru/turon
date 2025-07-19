import {createSlice} from "@reduxjs/toolkit";
import {postCreateSystemThunk} from "../createThunk/createThunk"

const initialState = {
    name: null,
    system: null,
    loading: false,
    error: false
}

const postCreateSystem = createSlice({
    name: "postCreateSystem",
    initialState,
    reducers: {},
    extraReducers: builder =>
        builder
            .addCase(postCreateSystemThunk.pending , state => {
                state.loading = true
                state.error = false
            })
            .addCase(postCreateSystemThunk.fulfilled , (state, action) => {
                state.system = action.payload
                state.name = action.payload
                state.loading = false
                state.error = false
            })
            .addCase(postCreateSystemThunk.rejected , (state , action) => {
                state.error = "error"
                state.loading = false
            })
})

export default postCreateSystem.reducer
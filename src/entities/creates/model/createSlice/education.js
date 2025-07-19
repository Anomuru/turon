import {createSlice} from "@reduxjs/toolkit";
import {postEducationThunk} from "../createThunk/education";

const initialState = {
    name: [],
    loading: false,
    error: false
}

const postEducationSlice = createSlice({
    name: "postEducationSlice",
    initialState,
    reducers: {},
    extraReducers: builder =>
        builder
            .addCase(postEducationThunk.pending , state => {
                state.loading = true
                state.error = false
            })
            .addCase(postEducationThunk.fulfilled , (state, action) => {
                state.name = action.payload
                state.loading = false
                state.error = false
            })
            .addCase(postEducationThunk.rejected , (state, action) => {
                state.loading = false
                state.error = "error"
            })
})

export default postEducationSlice.reducer
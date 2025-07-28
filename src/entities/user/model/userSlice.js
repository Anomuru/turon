import {createSlice} from "@reduxjs/toolkit";
import {fetchUserData} from "./userThunk";

const initialState = {
    userData: null,
    loading: false,
    error: null
}

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {},
    extraReducers: builder =>
        builder
            .addCase(fetchUserData.pending, state => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchUserData.fulfilled, (state, action) => {
                state.userData = action.payload
                state.loading = false
                state.error = null
            })
            .addCase(fetchUserData.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload ?? null
            })
})

export default userSlice.reducer
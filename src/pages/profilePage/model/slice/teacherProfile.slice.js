import {createSlice} from "@reduxjs/toolkit";

import {fetchTeacherProfileData} from "../thunk/teacherProfile.thunk";

const initialState = {
    data: null,
    loading: false,
    error: null
}

const TeacherProfileSlice = createSlice({
    name: "TeacherProfileSlice",
    initialState,
    reducers: {},
    extraReducers: builder =>
        builder
            .addCase(fetchTeacherProfileData.pending, state => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchTeacherProfileData.fulfilled, (state, action) => {
                state.data = action.payload
                state.loading = false
                state.error = null
            })
            .addCase(fetchTeacherProfileData.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload ?? null
            })
})

export default TeacherProfileSlice.reducer

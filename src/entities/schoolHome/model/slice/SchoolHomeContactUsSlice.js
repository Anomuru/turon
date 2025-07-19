import {createSlice} from "@reduxjs/toolkit";

import {fetchContactData} from "../thunk/homeContactThunk";

const initialState = {
    data: null,
    loading: false,
    error: null
}

const homeContactUsSlice = createSlice({
    name: "homeContactUsSlice",
    initialState,
    reducers: {
        onChangeContact: (state, action) => {
            state.data = [...state.data.filter(item => item.id !== action.payload.id) , action.payload.data]
        }

    },
    extraReducers: builder =>
        builder
            .addCase(fetchContactData.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchContactData.fulfilled, (state, action) => {
                state.data = action.payload
                state.loading = false
                state.error = null
            })
            .addCase(fetchContactData.rejected, (state) => {
                state.loading = false
                state.error = "error"
            })
})

export const {onChangeContact} = homeContactUsSlice.actions

export default homeContactUsSlice.reducer

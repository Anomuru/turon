import {createSlice} from "@reduxjs/toolkit";
import {getSystemThunk, changeSystemName} from "../thunk/systemThunk";


const initialState = {
    name: [],
    loading: false,
    error: false
}

const getSystemSlice = createSlice({
    name: "getSystemSlice",
    initialState,
    reducers: {
        onDeleteCapitalReducer: (state, action) => {
            state.name = state.name.filter(item => item.id !== action.payload.id)
        },
    },
    extraReducers: builder =>
        builder
            .addCase(getSystemThunk.pending, state => {
                state.loading = true
                state.error = false
            })
            .addCase(getSystemThunk.fulfilled, (state, action) => {
                state.name = action.payload
                state.loading = false
                state.error = false
            })
            .addCase(getSystemThunk.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload ?? null
            })
            .addCase(changeSystemName.pending, state => {
                state.loading = true
                state.error = null
            })
            .addCase(changeSystemName.fulfilled, (state, action) => {
                state.name = [
                    ...state.name.filter(item => item.id !== action.payload.id),
                    action.payload
                ]
                state.loading = false
                state.error = null
            })
            .addCase(changeSystemName.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload ?? null
            })
})

export const {onDeleteCapitalReducer} = getSystemSlice.actions
export default getSystemSlice.reducer

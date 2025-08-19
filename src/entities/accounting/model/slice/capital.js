import {createSlice} from "@reduxjs/toolkit";
import {capitalDeletedListThunk, capitalListThunk} from "../thunk/capital";


const initialState = {
    capital: [],
    capitalCount: 0,
    capitalDeleted: [],
    capitalDeletedCount: 0,
    loading: false,
    error: false
}

export const capitalList = createSlice({
    name: "capitalList",
    initialState,
    reducers: {
        onDeleteCapital: (state, action) => {
            state.capital = state.capital.filter(item => item.id !== action.payload.id)
        },
        onAddCapital: (state, action) => {
            state.capital = [...state.capital, action.payload]
        },
    },
    extraReducers: builder =>
        builder
            .addCase(capitalListThunk.pending , state => {
                state.loading = true
                state.error = false
            })
            .addCase(capitalListThunk.fulfilled , (state, action) => {
                state.capital = action.payload?.results
                state.capitalCount = action.payload?.count
                state.loading = false
                state.error =  false
            })
            .addCase(capitalListThunk.rejected , state => {
                state.loading = false
                state.error =  true
            })
            .addCase(capitalDeletedListThunk.pending , state => {
                state.loading = true
                state.error = false
            })
            .addCase(capitalDeletedListThunk.fulfilled , (state, action) => {
                state.capitalDeleted = action.payload?.results
                state.capitalDeletedCount = action.payload?.count
                state.loading = false
                state.error =  false
            })
            .addCase(capitalDeletedListThunk.rejected , state => {
                state.loading = false
                state.error =  true
            })
})

export const {onDeleteCapital , onAddCapital} = capitalList.actions
export const {reducer: capitalListReducer} = capitalList
export default capitalList.reducer
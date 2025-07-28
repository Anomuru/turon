import {createSlice} from "@reduxjs/toolkit";
import {createBranchThunk, getLocationThunk , changeLocation} from "../createThunk/createBranchThunk"


const initialState = {
    name: [],
    locationId: [],
    loading: false,
    error: false
}

const postCreateBranch = createSlice({
    name: "postCreateBranch",
    initialState,
    reducers: {
        onDeleteBranch: (state, action) => {
            state.locationId = state.locationId.filter(item => item.id !== action.payload.id)
        },
    },
    extraReducers: builder =>
        builder
            .addCase(createBranchThunk.pending , state => {
                state.loading = true
                state.error = false
            })
            .addCase(createBranchThunk.fulfilled , (state, action) => {
                state.name = action.payload
                state.loading = false
                state.error = false
            })
            .addCase(createBranchThunk.rejected , (state , action) => {
                state.error = action.payload ?? null
                state.loading = false
            })
            .addCase(getLocationThunk.pending , state => {
                state.loading = true
                state.error = false
            })
            .addCase(getLocationThunk.fulfilled , (state, action) => {
                state.locationId = action.payload
                state.loading = false
                state.error = false
            })
            .addCase(getLocationThunk.rejected , (state , action) => {
                state.error = action.payload ?? null
                state.loading = false
            })
            .addCase(changeLocation.pending, state => {
                state.loading = true
                state.error = null
            })
            .addCase(changeLocation.fulfilled, (state, action) => {
                state.name = [
                    ...state.name.filter(item => item.id !== action.payload.id),
                    action.payload
                ]
                state.loading = false
                state.error = null
            })
            .addCase(changeLocation.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload ?? null
            })
})
export const {onDeleteBranch} = postCreateBranch.actions
export default postCreateBranch.reducer
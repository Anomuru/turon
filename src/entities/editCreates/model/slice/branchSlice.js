import {createSlice} from "@reduxjs/toolkit";
import {getBranchThunk , changeBranchName} from "../thunk/branchThunk";



const initialState = {
    name: [],
    loading: false,
    error: false
}

const getBranchSlice = createSlice({
    name: "getBranchSlice",
    initialState,
    reducers: {
        onDeleteBranch: (state, action) => {
            state.name = state.name.filter(item => item.id !== action.payload.id)
        },
    },
    extraReducers: builder =>
        builder
            .addCase(getBranchThunk.pending , state => {
                state.loading = true
                state.error = false
            })
            .addCase(getBranchThunk.fulfilled , (state, action) => {
                state.name = action.payload
                state.loading = false
                state.error = false
            })
            .addCase(getBranchThunk.rejected , (state, action) => {
                state.loading = false
                state.error = "error"
            })
            .addCase(changeBranchName.pending, state => {
                state.loading = true
                state.error = null
            })
            .addCase(changeBranchName.fulfilled, (state, action) => {
                state.name = [
                    ...state.name.filter(item => item.id !== action.payload.id),
                    action.payload
                ]
                state.loading = false
                state.error = null
            })
            .addCase(changeBranchName.rejected, (state, action) => {
                state.loading = false
                state.error = "error"
            })
})

export default getBranchSlice.reducer
export const {onDeleteBranch}  =getBranchSlice.actions
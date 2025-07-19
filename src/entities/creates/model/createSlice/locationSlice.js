import {createSlice} from "@reduxjs/toolkit";
import {createLocationThunk} from "../createThunk/locationThunk"
import {getSystemId} from "../createThunk/createBranchThunk";

const initialState = {
    name: null,
    system: [],
    loading: false,
    error: false
}

const postCreateLocation = createSlice({
    name: "postCreateLocation",
    initialState,
    reducers: {},
    extraReducers: builder =>
        builder
            .addCase(createLocationThunk.pending , state => {
                state.loading = true
                state.error = false
            })
            .addCase(createLocationThunk.fulfilled , (state, action) => {
                state.name = action.payload
                state.loading = false
                state.error = false

            })
            .addCase(createLocationThunk.rejected , (state , action) => {
                state.error = true
                state.loading = false
            })
            .addCase(getSystemId.pending  ,state => {
                state.loading = true
                state.error = false
            })
            .addCase(getSystemId.fulfilled , (state, action) => {
                state.system = action.payload.systems
                state.loading = false
                state.error = false

            })
            .addCase(getSystemId.rejected , (state , action) => {
                state.error = true
                state.loading = false
            })
})

export default postCreateLocation.reducer
import {createSlice} from "@reduxjs/toolkit";
import {getEducationChange, getEducationThunk} from "../thunk/educationThunk";


const initialState = {
    educationName: [],
    loading: false,
    error: false
}


const getEducationSlice = createSlice({
    name: "getEducationSlice",
    initialState,
    reducers: {
        onDeleteEducation: (state, action) => {
            state.educationName = state.educationName.filter(item => item.id !== action.payload.id)
        },
    },
    extraReducers: builder =>
        builder
            .addCase(getEducationThunk.pending , state => {
                state.loading = true
            })
            .addCase(getEducationThunk.fulfilled , (state , action) => {
                state.educationName = action.payload.languages
                state.loading = false
                state.error = false
            })
            .addCase(getEducationThunk.rejected , state => {
                state.loading = false
                state.error = "error"
            })
            .addCase(getEducationChange.pending, state => {
                state.loading = true
                state.error = null
            })
            .addCase(getEducationChange.fulfilled, (state, action) => {
                state.educationName = [
                    ...state.educationName.filter(item => item.id !== action.payload.id),
                    action.payload
                ]
                state.loading = false
                state.error = null
            })
            .addCase(getEducationChange.rejected, (state, action) => {
                state.loading = false
                state.error = "error"
            })

})

export const {onDeleteEducation} = getEducationSlice.actions
export default getEducationSlice.reducer
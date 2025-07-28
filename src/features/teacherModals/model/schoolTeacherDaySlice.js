import {createSlice} from "@reduxjs/toolkit";
import {schoolTeacherDayThunk} from './schoolTeacherDayThunk'


const initialState = {
    workedDay: [],
    loading: false,
    error: null
}


export const schoolTeacherDaySlice = createSlice({
    name: "schoolTeacherDaySlice",
    initialState,
    reducers: {},
    extraReducers: builder => {
         builder
             .addCase(schoolTeacherDayThunk.pending, (state) => {
                 state.loading = true
                 state.error = null
             })
             .addCase(schoolTeacherDayThunk.fulfilled, (state, action) => {
                 state.loading = false;
                 state.error = null
                 state.workedDay = action.payload
             })
             .addCase(schoolTeacherDayThunk.rejected, (state,action) => {
                 state.loading = false;
                 state.error = action.error.message
             })
    }
})


export default schoolTeacherDaySlice.reducer
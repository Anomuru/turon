import {createSlice} from "@reduxjs/toolkit";
import {studiyngStudentDelThunk} from './studiyngStudentDelThunk'

const initialState = {
    studentIsDelete: [],
    loading: false,
    error: null
}


const studiyngStudentDelSlice = createSlice({
    name: 'studiyngStudentDelSlice',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(studiyngStudentDelThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(studiyngStudentDelThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.studentIsDelete = action.payload;
                state.error = null
            })
            .addCase(studiyngStudentDelThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message
            })
    }
})


export default studiyngStudentDelSlice.reducer
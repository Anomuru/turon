import {createSlice} from "@reduxjs/toolkit";
import {fetchDeletedTeachersData, fetchTeachersData, fetchTeachersDataWithFilter} from "./teacherThunk";


const initialState = {
    teachersData: [],
    teacherStatus: "idle",
    deletedTeachers: [],
    teachersDataWithFilter: [],
    loading: false
}

export const teachersSlice = createSlice({
    name: "teachersSlice",
    initialState,
    reducers: {

        onDelete: (state, action) => {
            console.log(action.payload, "hello")
            state.teachersData = state.teachersData.filter(item => item.id !== +action.payload)
        },
    },
    extraReducers: builder => {
        builder
            .addCase(fetchTeachersData.pending, state => {
                state.loading = true
            })
            .addCase(fetchTeachersData.fulfilled, (state, action) => {
                state.teachersData = action.payload
                state.loading = false
            })
            .addCase(fetchTeachersData.rejected, (state, action) => {
                state.error = "error"
            })


            .addCase(fetchDeletedTeachersData.pending, state => {
                state.loading = true
                state.error = false
            })
            .addCase(fetchDeletedTeachersData.fulfilled , (state, action) => {
                state.deletedTeachers = action.payload
                state.loading = false
                state.error = false
            })
            .addCase(fetchDeletedTeachersData.rejected , state => {
                state.loading = false
                state.error = true
            })


            .addCase(fetchTeachersDataWithFilter.pending, state => {
                state.loading = true
            })
            .addCase(fetchTeachersDataWithFilter.fulfilled, (state, action) => {
                state.teachersDataWithFilter = action.payload
                state.loading = false
            })
            .addCase(fetchTeachersDataWithFilter.rejected, (state, action) => {
                state.error = "error"
            })
    }
})


export const {onDelete} = teachersSlice.actions

export default teachersSlice.reducer
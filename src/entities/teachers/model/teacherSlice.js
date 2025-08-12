import {createSlice} from "@reduxjs/toolkit";
import {fetchDeletedTeachersData, fetchTeachersData, fetchTeachersDataWithFilter} from "./teacherThunk";


const initialState = {
    teachersData: [],
    teacherStatus: "idle",
    deletedTeachers: [],
    teachersDataWithFilter: [],
    loading: false,
    totalCount: null
}

export const teachersSlice = createSlice({
    name: "teachersSlice",
    initialState,
    reducers: {

        onDelete: (state, action) => {
            state.teachersDataWithFilter = state.teachersDataWithFilter.filter(item => item.id !== +action.payload)
        },
    },
    extraReducers: builder => {
        builder
            .addCase(fetchTeachersData.pending, state => {
                state.loading = true
            })
            .addCase(fetchTeachersData.fulfilled, (state, action) => {
                state.teachersData = action.payload.results
                state.totalCount = action.payload.count

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
                state.totalCount = action.payload.count
                state.loading = false
                console.log(action.payload)
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
                state.teachersDataWithFilter = action.payload.results
                state.totalCount = action.payload.count
                state.loading = false
            })
            .addCase(fetchTeachersDataWithFilter.rejected, (state, action) => {
                state.error = "error"
            })
    }
})


export const {onDelete} = teachersSlice.actions

// export default teachersSlice.reducer
export const {reducer: teacherReducer} = teachersSlice
import {createSlice} from "@reduxjs/toolkit";
import {fetchFilteredGroups} from "./filterGroupsThunk"

const initialState = {
    groups: null,
    teacherId: null,
    subjectId: null,
    typeId: null,
    isDelete: false,
    loading: false,
    error: null
}

export const filterGroupsSlices = createSlice({
    name: "filterGroups",
    initialState,
    reducers: {
        getTeacherId: (state, action) => {
            state.teacherId = action.payload
        },
        getSubjectId: (state, action) => {
            state.subjectId = action.payload
        },
        getTypeId: (state, action) => {
            state.typeId = action.payload
        },
        getIsDelete: (state, action) => {
            state.isDelete = action.payload
        }
    },
    extraReducers: builder =>
        builder
            .addCase(fetchFilteredGroups.pending, state => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchFilteredGroups.fulfilled, (state, action) => {
                state.groups = action.payload
                state.loading = false
                state.error = null
            })
            .addCase(fetchFilteredGroups.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload ?? null
            })
})

export default filterGroupsSlices.reducer
export const {
    getTeacherId,
    getSubjectId,
    getTypeId,
    getIsDelete
} = filterGroupsSlices.actions

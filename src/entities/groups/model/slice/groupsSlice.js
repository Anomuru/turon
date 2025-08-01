
import {createSlice} from "@reduxjs/toolkit";
import { fetchGroupsDataWithFilter, fetchGroupTypeThunk} from "./groupsThunk";

const initialState = {
    data: [],
    typeData: [],
    loading: false,
    loadingClasses: false,
    error: null
}

export const groupsSlice = createSlice({
    name: "groupsSlice",
    initialState,
    reducers: {
        deleteGroup: (state, action) => {
            state.data = state.data.filter(item => item.id !== action.payload)
        }
    },
    extraReducers: builder =>
        builder
            .addCase(fetchGroupsDataWithFilter.pending, state => {
                state.loadingClasses = true
                state.error = null
            })
            .addCase(fetchGroupsDataWithFilter.fulfilled, (state, action) => {
                state.data = action.payload
                state.loadingClasses = false
                state.error = null
            })
            .addCase(fetchGroupsDataWithFilter.rejected, (state, action) => {
                state.loadingClasses = false
                state.error = action.payload ?? null
            })



            .addCase(fetchGroupTypeThunk.pending, state => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchGroupTypeThunk.fulfilled, (state, action) => {
                state.typeData = action.payload
                state.loading = false
                state.error = null
            })
            .addCase(fetchGroupTypeThunk.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload ?? null
            })
})

export const {deleteGroup} = groupsSlice.actions
// export default groupsSlice.reducer

export const {reducer: groupsReducer} = groupsSlice

import {createSlice} from "@reduxjs/toolkit";
import {fetchClassesDataForFlow, fetchGroupsDataWithFilter, fetchGroupTypeThunk} from "./groupsThunk";

const initialState = {
    data: [],
    totalCount: 0,
    typeData: [],
    dataForFlow: [],
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
                state.data = action.payload?.results
                state.totalCount = action.payload?.count
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

            .addCase(fetchClassesDataForFlow.pending, state => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchClassesDataForFlow.fulfilled, (state, action) => {
                state.dataForFlow = action.payload?.results
                state.loading = false
                state.error = null
            })
            .addCase(fetchClassesDataForFlow.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload ?? null
            })
})

export const {deleteGroup} = groupsSlice.actions
// export default groupsSlice.reducer

export const {reducer: groupsReducer} = groupsSlice
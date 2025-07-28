import {createSlice} from "@reduxjs/toolkit";
import {fetchSearch} from "./searchThunk";

const initialState = {
    search: null,
    loading: false,
    error: null
}

export const searchSlice = createSlice({
    name: "searchSlice",
    initialState,
    reducers: {
        getSearchStr: (state, action) => {
            state.search = action.payload
            state.loading = false
            state.error = null
        }
    },
    extraReducers: builder =>
        builder
            .addCase(fetchSearch.pending, state => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchSearch.fulfilled, (state, action) => {
                state.newStudents = action.payload
                state.loading = false
                state.error = null
            })
            .addCase(fetchSearch.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload ?? null
            })

})

export default searchSlice.reducer
export const {getSearchStr} = searchSlice.actions
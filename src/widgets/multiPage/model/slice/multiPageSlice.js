import {createSlice} from "@reduxjs/toolkit";
import {fetchMultiPageDataThunk} from "../thunk/multiPageThunk";

const initialState = {


    data: [],
    changedPage: false,
    oldPage: "",
    oldLength: null,

    loading: false,
    error: null,
    fetchStatus: "idle"
}

const multiPageSlice = createSlice({
    name: "MultiPageSlice",
    initialState,
    reducers: {
        onChangedPage: (state, action) => {
            state.changedPage = action.payload
        },

        onChangedOldPage: (state, action) => {
            state.oldPage = action.payload
        },

        onChangedOldLength: (state, action) => {
            state.oldLength = action.payload
        }
    },
    extraReducers: builder =>
        builder
            .addCase(fetchMultiPageDataThunk.pending, state => {
                state.loading = true
                state.error = null
                state.fetchStatus = "loading"
            })
            .addCase(fetchMultiPageDataThunk.fulfilled, (state, action) => {
                state.data = action.payload
                state.loading = false
                state.error = null
                state.fetchStatus = "success"

            })
            .addCase(fetchMultiPageDataThunk.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload ?? null
            })
})

export default multiPageSlice.reducer
export const {
    onChangedPage,
    onChangedOldPage,
    onChangedOldLength
} = multiPageSlice.actions

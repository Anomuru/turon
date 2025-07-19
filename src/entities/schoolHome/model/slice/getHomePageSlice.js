import {createSlice} from "@reduxjs/toolkit";
import {fetchHomePage} from "../thunk/getHomePageSelector";


const initialState = {
    data: [],
    loading: false,
    error: false
}


export const getHomePageSlice = createSlice({
    name: "getHomePageSlice",
    initialState,
    reducers: {},
    extraReducers: builder =>
        builder
            .addCase(fetchHomePage.pending, state => {
                state.loading = true
                state.error = false
            })
            .addCase(fetchHomePage.fulfilled, (state , action) => {
                state.loading = false
                state.error = false
                state.data = action.payload
                console.log(action.payload)
            })
            .addCase(fetchHomePage.rejected, state => {
                state.loading = false
                state.error = false
            })
})

export default getHomePageSlice.reducer
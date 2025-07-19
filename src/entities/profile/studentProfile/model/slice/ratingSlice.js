import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    data: null,
    loading: true,
    error: null
}

const RatingSlice = createSlice({
    name: "RatingSlice",
    initialState,
    reducers: {
        fetch: (state, action) => {
            state.data = action.payload
        }
    }
})

export default RatingSlice.reducer

export const {fetch} = RatingSlice.actions

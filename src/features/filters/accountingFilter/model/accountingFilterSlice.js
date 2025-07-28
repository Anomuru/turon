import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    isDelete: false,
    isArchive: false
}

const accountingFilterSlice = createSlice({
    name: "accountingFilterSlice",
    initialState,
    reducers: {
        fetchIsDelete: (state, action) => {
            state.isDelete = action.payload
        },
        fetchIsArchive: (state, action) => {
            state.isArchive = action.payload
        }
    }
})

export default accountingFilterSlice.reducer
export const {
    fetchIsDelete,
    fetchIsArchive
} = accountingFilterSlice.actions

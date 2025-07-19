import {createSlice} from "@reduxjs/toolkit";
import {getEmployerCategory} from "./employerCategoryThunk";


const initialState = {
    loading: false,
    error: false,
    employerCategoryData: []
}

export const employerCategorySlice = createSlice({
    name: "employerCategory",
    initialState,
    reducers: {
        updateCategory: (state, action) => {

            state.employerCategoryData = [...state.employerCategoryData, action.payload]
        },
        changeName: (state, action) => {
            state.employerCategoryData = [
                ...state.employerCategoryData.filter(item => item.id !== action.payload.id),
                action.payload
            ]
            state.loading = false
            state.error = null
        },
        deleteEmployerCategory: (state, action) => {
            state.employerCategoryData = state.employerCategoryData.filter(item => item.id !== action.payload.id)
        }
    },
    extraReducers: builder =>
        builder
            .addCase(getEmployerCategory.pending, state => {
                state.error = false
                state.loading = true
            })
            .addCase(getEmployerCategory.fulfilled, (state, action) => {
                state.employerCategoryData = action.payload
                state.error = false
                state.loading = false
            })
            .addCase(getEmployerCategory.rejected, state => {
                state.error = true
                state.loading = false
            })
})

export const {updateCategory, changeName, deleteEmployerCategory} = employerCategorySlice.actions

export default employerCategorySlice.reducer
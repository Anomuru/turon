import {createSlice} from "@reduxjs/toolkit";
import {getVisionSchool} from "../thunk/missionSchoolThunk";



const initialState = {
    data: [],
    loading: false,
    error: false
}


export const visionSchoolSlice = createSlice({
    name: "visionSchoolSlice",
    initialState,
    reducers: {

        onAdd: (state, action) => {
            state.data = [...state.data, action.payload]
        },

        onDelete: (state, action) => {
            state.data = [...state.data.filter(item => item.id !== action.payload)]
        },
        onEdit: (state, action) => {
            state.data = [...state.data.filter(item => item.id !== action.payload.id), action.payload.data]
        },

    },
    extraReducers: builder =>
        builder
            .addCase(getVisionSchool.pending, state => {
                state.loading = true
                state.error = false
            })
            .addCase(getVisionSchool.fulfilled, (state , action) => {
                state.loading = false
                state.error = false
                state.data = action.payload
                console.log(action.payload)
            })
            .addCase(getVisionSchool.rejected, state => {
                state.loading = false
                state.error = false
            })
})

export const {onAdd , onDelete , onEdit} = visionSchoolSlice.actions

export default visionSchoolSlice.reducer
import {createSlice} from "@reduxjs/toolkit";


import {getStudentProfile} from "../thunk/schoolStudentProfileThunk";

const initialState = {
    data: []
}


const schoolProfileSlice = createSlice({
    name: "schoolProfileSlice",
    reducers: {
        onAdd : (state , action) => {
            state.data = [...state.data , action.payload]
        },
        onDelete : (state , action) => {
            state.data = [...state.data.filter(item => item.id !== action.payload)]
        },
        onEdit : (state , action) => {
            state.data = [...state.data.filter(item => item.id !== action.payload.id) , action.payload.data]
        }


    },
    initialState,
    extraReducers: builder =>
        builder
            .addCase(getStudentProfile.pending, state => {
                state.loading = true
                state.error = false

            })
            .addCase(getStudentProfile.fulfilled, (state , action) => {
                state.loading = false
                state.data = action.payload
                state.error = false
            })
            .addCase(getStudentProfile.rejected, state => {
                state.loading = false
                state.error = true
            })
})

export const {onAdd , onDelete , onEdit} = schoolProfileSlice.actions
export default schoolProfileSlice.reducer
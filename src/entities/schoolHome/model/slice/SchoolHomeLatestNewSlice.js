import {createSlice} from "@reduxjs/toolkit";
import {getLatestNew} from "../thunk/schoolLatestNewThunk";


const initialState = {
    data: []
}


const schoolLatestSlice = createSlice({
    name: "schoolLatestSlice",
    reducers: {
        onAdd: (state, action) => {
            state.data = [...state.data, action.payload]
        },
        onDelete: (state, action) => {
            state.data = [...state.data.filter(item => item.id !== action.payload)]
        },
        onEdit: (state, action) => {
            state.data = [...state.data.filter(item => item.id !== action.payload.id), action.payload.data]
        }


    },
    initialState,
    extraReducers: builder =>
        builder
            .addCase(getLatestNew.pending, state => {
                state.loading = true
                state.error = false

            })
            .addCase(getLatestNew.fulfilled, (state , action) => {
                state.loading = false
                state.data = action.payload
                state.error = false
            })
            .addCase(getLatestNew.rejected, state => {
                state.loading = false
                state.error = true
            })
})

export const {onAdd, onDelete, onEdit} = schoolLatestSlice.actions
export default schoolLatestSlice.reducer
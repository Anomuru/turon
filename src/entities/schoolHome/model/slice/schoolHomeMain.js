import {createSlice} from "@reduxjs/toolkit";

import {
    editDescription,
    editProgram,
    fetchAddPrograms,
    fetchHomeMainData,
    fetchHomeMainDescription
} from "../thunk/schoolHomeMainThunk";

const initialState = {
    data: null,
    description: null,
    secondDescription: null,
    loading: false,
    error: null
}

const schoolHomeMainSlice = createSlice({
    name: "schoolHomeMainSlice",
    initialState,
    reducers: {
        onDeleteHomeBox: (state , action) => {
            state.data = [...state.data.filter(item => item.id !== action.payload )]
        }

    },
    extraReducers: builder =>
        builder
            .addCase(fetchHomeMainData.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchHomeMainData.fulfilled, (state, action) => {
                state.data = action.payload
                state.loading = false
                state.error = null
            })
            .addCase(fetchHomeMainData.rejected, (state) => {
                state.loading = false
                state.error = "error"
            })
            .addCase(fetchHomeMainDescription.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchHomeMainDescription.fulfilled, (state, action) => {
                if (action.payload[0]?.type === 8) {
                    state.description = action.payload
                } else if (action.payload[0]?.type === 10) {
                    state.secondDescription = action.payload
                }
                state.loading = false
                state.error = null
            })
            .addCase(fetchHomeMainDescription.rejected, (state) => {
                state.loading = false
                state.error = "error"
            })
            .addCase(fetchAddPrograms.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchAddPrograms.fulfilled, (state, action) => {
                state.data = [...state.data, action.payload]
                state.loading = false
                state.error = null
            })
            .addCase(fetchAddPrograms.rejected, (state) => {
                state.loading = false
                state.error = "error"
            })
            .addCase(editProgram.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(editProgram.fulfilled, (state, action) => {
                state.data = state.data.map(
                    item => {
                        if (item?.id === action.payload.id) {
                            console.log(item)
                            return action.payload
                        } else return item
                    }
                )
                state.loading = false
                state.error = null
            })
            .addCase(editProgram.rejected, (state) => {
                state.loading = false
                state.error = "error"
            })
            .addCase(editDescription.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(editDescription.fulfilled, (state, action) => {
                if (action.payload?.type === 8) {
                    state.description = [action.payload]
                } else if (action.payload?.type === 10) {
                    state.secondDescription = [action.payload]
                }
                state.loading = false
                state.error = null
            })
            .addCase(editDescription.rejected, (state) => {
                state.loading = false
                state.error = "error"
            })
})

export const {onDeleteHomeBox} = schoolHomeMainSlice.actions

export default schoolHomeMainSlice.reducer

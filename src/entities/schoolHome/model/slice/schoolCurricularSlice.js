import {createSlice} from "@reduxjs/toolkit";

import {getExtraCurriculum , getCurriculum} from "../thunk/curriculumThunk";

const initialState = {
    data: [],
    curriculum: []
}


const schoolCurricularSlice = createSlice({
    name: "schoolCurricularSlice",
    reducers: {
        onAddCurricular: (state, action) => {
            state.data = [...state.data, action.payload]
        },

        onDeleteCurricular: (state, action) => {
            state.data = [...state.data.filter(item => item.id !== action.payload)]
        },
        onEditCurricular: (state, action) => {
            state.data = [...state.data.filter(item => item.id !== action.payload.id), action.payload.data]
        },




        onExtraAddCurricular: (state, action) => {
            state.curriculum = [...state.curriculum, action.payload]
        },

        onExtraDeleteCurricular: (state, action) => {
            state.curriculum = [...state.curriculum.filter(item => item.id !== action.payload)]
        },
        onExtraEditCurricular: (state, action) => {
            state.curriculum = [...state.curriculum.filter(item => item.id !== action.payload.id), action.payload.data]
        },
    },
    initialState,
    extraReducers: builder =>
        builder
            .addCase(getCurriculum.pending, state => {
                state.loading = true
                state.error = false

            })
            .addCase(getCurriculum.fulfilled, (state , action) => {
                state.loading = false
                state.data = action.payload
                state.error = false
            })
            .addCase(getCurriculum.rejected, state => {
                state.loading = false
                state.error = true
            })
            .addCase(getExtraCurriculum.pending, state => {
                state.loading = true
                state.error = false

            })
            .addCase(getExtraCurriculum.fulfilled, (state , action) => {
                state.loading = false
                state.curriculum = action.payload
                state.error = false
            })
            .addCase(getExtraCurriculum.rejected, state => {
                state.loading = false
                state.error = true
            })
})


export const {onDeleteCurricular, onAddCurricular, onEditCurricular , onExtraEditCurricular , onExtraAddCurricular , onExtraDeleteCurricular} = schoolCurricularSlice.actions
export default schoolCurricularSlice.reducer
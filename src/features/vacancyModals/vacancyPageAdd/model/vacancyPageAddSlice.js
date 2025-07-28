import {createSlice} from "@reduxjs/toolkit";
import {vacancyPageAddThunk} from "./vacancyPageAddThunk";

const initialState = {
    vacancies: [],
    loading: false,
    error: null
}

const vacancySlice = createSlice({
    name: 'vacancies',
    initialState,
    reducers: {
        addVacancy: (state, action) => {
            state.vacancies.push(action.payload);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(vacancyPageAddThunk.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(vacancyPageAddThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.vacancies.push(action.payload);
            })
            .addCase(vacancyPageAddThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? null
            })


    }
})

export const {addVacancy} = vacancySlice.actions

export default vacancySlice.reducer
import {createSlice} from "@reduxjs/toolkit";
import {fetchVacancyData} from "./vacancyPageParseThunk";

const initialState = {
    vacanciesData: [],
    loading: false,
    error: null
}


export const vacancyPageParseSlice = createSlice({
    name:'vacancyPageParseSlice',
    initialState,
    reducers: {},
    extraReducers: builder =>
        builder
            .addCase(fetchVacancyData.pending, (state) => {state.loading = true})
            .addCase(fetchVacancyData.fulfilled, (state, action) => {
                state.loading = false;
                state.vacanciesData = action.payload?.jobs
            })
            .addCase(fetchVacancyData.rejected, (state) => {
                state.error = 'error'
            })
})

export const {reducer: vacancyPageParseReducer} = vacancyPageParseSlice

// export default vacancyPageParseSlice.reducer
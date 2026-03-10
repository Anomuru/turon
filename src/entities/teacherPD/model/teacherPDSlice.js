import { createSlice } from '@reduxjs/toolkit';
import { fetchTeacherPDList, fetchTeacherPDById } from './teacherPDThunk';

const initialState = {
    pdList: [],
    currentPD: null,
    loading: false,
    error: null,
};

export const teacherPDSlice = createSlice({
    name: 'teacherPD',
    initialState,
    reducers: {
        clearCurrentPD: (state) => {
            state.currentPD = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTeacherPDList.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTeacherPDList.fulfilled, (state, action) => {
                state.pdList = Array.isArray(action.payload)
                    ? action.payload
                    : action.payload.results ?? [];
                state.loading = false;
            })
            .addCase(fetchTeacherPDList.rejected, (state) => {
                state.loading = false;
                state.error = 'Error fetching PD list';
            })
            .addCase(fetchTeacherPDById.fulfilled, (state, action) => {
                state.currentPD = action.payload;
            });
    },
});

export const { clearCurrentPD } = teacherPDSlice.actions;
export const { reducer: teacherPDReducer } = teacherPDSlice;

import { createSlice } from "@reduxjs/toolkit";
import { fetchLoans, fetchLoanById } from "./loansThunk";

const initialState = {
    loading: false,
    error: false,
    loans: [],
    currentLoan: null,
    loadingLoan: false,
    errorLoan: false,
};

const loansSlice = createSlice({
    name: "loansSlice",
    initialState,
    reducers: {
        clearCurrentLoan: (state) => {
            state.currentLoan = null;
            state.loadingLoan = false;
            state.errorLoan = false;
        },
    },
    extraReducers: (builder) =>
        builder
            // Fetch loans list
            .addCase(fetchLoans.pending, (state) => {
                state.loading = true;
                state.error = false;
            })
            .addCase(fetchLoans.fulfilled, (state, action) => {
                state.error = false;
                state.loading = false;
                state.loans = action.payload?.results || action.payload || [];
            })
            .addCase(fetchLoans.rejected, (state) => {
                state.error = true;
                state.loading = false;
            })
            // Fetch loan by ID
            .addCase(fetchLoanById.pending, (state) => {
                state.loadingLoan = true;
                state.errorLoan = false;
            })
            .addCase(fetchLoanById.fulfilled, (state, action) => {
                state.errorLoan = false;
                state.loadingLoan = false;
                state.currentLoan = action.payload?.data || action.payload;
            })
            .addCase(fetchLoanById.rejected, (state) => {
                state.errorLoan = true;
                state.loadingLoan = false;
            }),
});

export default loansSlice.reducer;
export const { reducer: loansReducer } = loansSlice;
export const { clearCurrentLoan } = loansSlice.actions;

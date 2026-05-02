import { createSlice } from "@reduxjs/toolkit";
import { fetchBranchLoans, fetchOutstandingLoans, createLoan } from "./loansThunk";

const initialState = {
    loans: {
        count: 0,
        next: null,
        previous: null,
        results: [],
    },
    outstanding: [],
    loading: false,
    error: null,
};

const loansSlice = createSlice({
    name: "loans",
    initialState,
    reducers: {
        clearLoans: (state) => {
            state.loans = initialState.loans;
            state.outstanding = [];
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchBranchLoans.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBranchLoans.fulfilled, (state, action) => {
                state.loading = false;
                // Handle API response structure: { count, next, previous, results: { data: [...], totalCount: [...] } }
                if (action.payload && typeof action.payload === 'object') {
                    const payload = action.payload;

                    // Check if results.data exists (new API structure)
                    if (payload.results && payload.results.data && Array.isArray(payload.results.data)) {
                        state.loans = {
                            count: payload.count || 0,
                            next: payload.next || null,
                            previous: payload.previous || null,
                            results: payload.results.data,
                            totalCount: payload.results.totalCount || [],
                        };
                    }
                    // Check if results is an array (old API structure)
                    else if (payload.results && Array.isArray(payload.results)) {
                        state.loans = payload;
                    }
                    // Check if payload itself is an array
                    else if (Array.isArray(payload)) {
                        state.loans = {
                            count: payload.length,
                            next: null,
                            previous: null,
                            results: payload,
                        };
                    } else {
                        state.loans = initialState.loans;
                    }
                } else {
                    state.loans = initialState.loans;
                }
            })
            .addCase(fetchBranchLoans.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchOutstandingLoans.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOutstandingLoans.fulfilled, (state, action) => {
                state.loading = false;
                state.outstanding = action.payload?.data || [];
            })
            .addCase(fetchOutstandingLoans.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createLoan.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createLoan.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(createLoan.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearLoans } = loansSlice.actions;
export default loansSlice.reducer;

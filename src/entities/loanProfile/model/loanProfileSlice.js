import { createSlice } from "@reduxjs/toolkit";
import { fetchLoanProfile, updateLoanProfile, repayLoan, cancelLoan } from "./loanProfileThunk";

// Temporary mock data for testing loan profile
const mockLoanProfiles = {
    1: {
        id: 1,
        branch_id: 1,
        counterparty: { id: 1, name: "Aliyev", surname: "Sardor", phone: "+998901234567" },
        direction: "out",
        principal_amount: 50000000,
        paid_total: 30000000,
        remaining_amount: 20000000,
        is_settled: false,
        issued_date: "2026-01-15",
        due_date: "2026-12-31",
        settled_date: null,
        reason: "Biznes uchun qarz",
        notes: "Oyiga 5,000,000 so'm to'lash kelishilgan",
        status: "active",
        cancelled_reason: null,
        management_id: 1,
    },
    2: {
        id: 2,
        branch_id: 1,
        counterparty: { id: 2, name: "Karimova", surname: "Dilnoza", phone: "+998909876543" },
        direction: "in",
        principal_amount: 10000000,
        paid_total: 10000000,
        remaining_amount: 0,
        is_settled: true,
        issued_date: "2025-06-01",
        due_date: "2025-12-31",
        settled_date: "2025-11-20",
        reason: "Qisqa muddatli qarz",
        notes: "",
        status: "settled",
        cancelled_reason: null,
        management_id: 1,
    },
    3: {
        id: 3,
        branch_id: 1,
        counterparty: { id: 3, name: "Toshmatov", surname: "Jasur", phone: "+998901112233" },
        direction: "out",
        principal_amount: 25000000,
        paid_total: 0,
        remaining_amount: 25000000,
        is_settled: false,
        issued_date: "2026-03-10",
        due_date: "2026-09-10",
        settled_date: null,
        reason: "Uy ta'mirlash uchun",
        notes: "",
        status: "cancelled",
        cancelled_reason: "Kontragent bilan kelishuv bekor qilindi",
        management_id: 1,
    },
    4: {
        id: 4,
        branch_id: 1,
        counterparty: { id: 4, name: "Rahimov", surname: "Aziz", phone: "+998905554433" },
        direction: "out",
        principal_amount: 15000000,
        paid_total: 5000000,
        remaining_amount: 10000000,
        is_settled: false,
        issued_date: "2026-02-20",
        due_date: "2026-08-20",
        settled_date: null,
        reason: "Avtomobil sotib olish",
        notes: "Har oyning 15-sanasida to'lov",
        status: "active",
        cancelled_reason: null,
        management_id: 1,
    },
    5: {
        id: 5,
        branch_id: 1,
        counterparty: { id: 5, name: "Yusupova", surname: "Malika", phone: "+998907778899" },
        direction: "in",
        principal_amount: 8000000,
        paid_total: 3000000,
        remaining_amount: 5000000,
        is_settled: false,
        issued_date: "2026-04-01",
        due_date: "2026-10-01",
        settled_date: null,
        reason: "Shaxsiy ehtiyoj",
        notes: "",
        status: "active",
        cancelled_reason: null,
        management_id: 1,
    },
};

const initialState = {
    loading: false,
    error: false,
    loanProfile: null,
    updating: false,
    updateError: false,
    repaying: false,
    repayError: false,
    cancelling: false,
    cancelError: false,
};

const loanProfileSlice = createSlice({
    name: "loanProfileSlice",
    initialState,
    reducers: {
        clearLoanProfile: (state) => {
            state.loanProfile = null;
            state.loading = false;
            state.error = false;
        },
    },
    extraReducers: (builder) =>
        builder
            .addCase(fetchLoanProfile.pending, (state, action) => {
                state.loading = true;
                state.error = false;
                // Immediately load mock data while API is pending
                const loanId = action.meta?.arg;
                state.loanProfile = mockLoanProfiles[loanId] || null;
            })
            .addCase(fetchLoanProfile.fulfilled, (state, action) => {
                state.error = false;
                state.loading = false;
                // Use API data if available, otherwise use mock data
                const apiData = action.payload?.data || action.payload;
                if (apiData && apiData.id) {
                    state.loanProfile = apiData;
                } else {
                    // Fallback to mock data
                    const loanId = action.meta?.arg;
                    state.loanProfile = mockLoanProfiles[loanId] || null;
                }
            })
            .addCase(fetchLoanProfile.rejected, (state, action) => {
                state.error = false; // Don't show error if we have mock data
                state.loading = false;
                // Keep mock data that was loaded in pending state
                if (!state.loanProfile) {
                    const loanId = action.meta?.arg;
                    state.loanProfile = mockLoanProfiles[loanId] || null;
                }
            })
            // Update loan profile
            .addCase(updateLoanProfile.pending, (state) => {
                state.updating = true;
                state.updateError = false;
            })
            .addCase(updateLoanProfile.fulfilled, (state, action) => {
                state.updating = false;
                state.updateError = false;
                const apiData = action.payload?.data || action.payload;
                if (apiData && apiData.id) {
                    state.loanProfile = apiData;
                }
            })
            .addCase(updateLoanProfile.rejected, (state) => {
                state.updating = false;
                state.updateError = true;
            })
            // Repay loan
            .addCase(repayLoan.pending, (state) => {
                state.repaying = true;
                state.repayError = false;
            })
            .addCase(repayLoan.fulfilled, (state, action) => {
                state.repaying = false;
                state.repayError = false;
                const apiData = action.payload?.data || action.payload;
                if (apiData && apiData.id) {
                    state.loanProfile = apiData;
                }
            })
            .addCase(repayLoan.rejected, (state) => {
                state.repaying = false;
                state.repayError = true;
            })
            // Cancel loan
            .addCase(cancelLoan.pending, (state) => {
                state.cancelling = true;
                state.cancelError = false;
            })
            .addCase(cancelLoan.fulfilled, (state, action) => {
                state.cancelling = false;
                state.cancelError = false;
                const apiData = action.payload?.data || action.payload;
                if (apiData && apiData.id) {
                    state.loanProfile = apiData;
                }
            })
            .addCase(cancelLoan.rejected, (state) => {
                state.cancelling = false;
                state.cancelError = true;
            }),
});

export default loanProfileSlice.reducer;
export const { reducer: loanProfileReducer } = loanProfileSlice;
export const { clearLoanProfile } = loanProfileSlice.actions;

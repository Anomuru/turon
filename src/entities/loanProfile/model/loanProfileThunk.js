import { createAsyncThunk } from "@reduxjs/toolkit";
import { API_URL, headers, useHttp } from "shared/api/base";

export const fetchLoanProfile = createAsyncThunk(
    "loanProfileSlice/fetchLoanProfile",
    async (loanId) => {
        const { request } = useHttp();
        return await request(`${API_URL}Branch/branch_loans/${loanId}/`, "GET", null, headers());
    }
);

export const updateLoanProfile = createAsyncThunk(
    "loanProfileSlice/updateLoanProfile",
    async ({ loanId, data }) => {
        const { request } = useHttp();
        return await request(
            `${API_URL}Branch/branch_loans/${loanId}/update/`,
            "PATCH",
            JSON.stringify(data),
            headers()
        );
    }
);

export const repayLoan = createAsyncThunk(
    "loanProfileSlice/repayLoan",
    async ({ loanId, data }) => {
        const { request } = useHttp();
        return await request(
            `${API_URL}Branch/branch_loans/${loanId}/repay/`,
            "POST",
            JSON.stringify(data),
            headers()
        );
    }
);

export const cancelLoan = createAsyncThunk(
    "loanProfileSlice/cancelLoan",
    async ({ loanId, cancelled_reason }) => {
        const { request } = useHttp();
        return await request(
            `${API_URL}Branch/branch_loans/${loanId}/cancel/`,
            "POST",
            JSON.stringify({ cancelled_reason }),
            headers()
        );
    }
);


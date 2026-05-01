import { createAsyncThunk } from "@reduxjs/toolkit";
import { API_URL, headers, useHttp } from "shared/api/base";

export const fetchLoans = createAsyncThunk(
    "loansSlice/fetchLoans",
    async ({ branchId, filters = {} }) => {
        const { request } = useHttp();
        const params = new URLSearchParams({ branch: branchId });

        if (filters.direction) params.set("direction", filters.direction);
        if (filters.status) params.set("status", filters.status);
        if (filters.search) params.set("search", filters.search);

        return await request(`${API_URL}Branch/branch_loans/?${params}`, "GET", null, headers());
    }
);

export const fetchLoanById = createAsyncThunk(
    "loansSlice/fetchLoanById",
    async (loanId) => {
        const { request } = useHttp();
        return await request(`${API_URL}Branch/branch_loans/${loanId}/`, "GET", null, headers());
    }
);

import { createAsyncThunk } from "@reduxjs/toolkit";
import { API_URL, headers, useHttp } from "shared/api/base";

export const fetchBranchLoans = createAsyncThunk(
    "loans/fetchBranchLoans",
    async (params, { rejectWithValue }) => {
        try {
            const { request } = useHttp();
            const queryParams = new URLSearchParams();

            if (params.branch) queryParams.append("branch", params.branch);
            if (params.counterparty) queryParams.append("counterparty", params.counterparty);
            if (params.direction) queryParams.append("direction", params.direction);
            if (params.status) queryParams.append("status", params.status);
            if (params.search) queryParams.append("search", params.search);
            if (params.due_date_after) queryParams.append("due_date_after", params.due_date_after);
            if (params.due_date_before) queryParams.append("due_date_before", params.due_date_before);
            if (params.issued_date_after) queryParams.append("issued_date_after", params.issued_date_after);
            if (params.issued_date_before) queryParams.append("issued_date_before", params.issued_date_before);
            if (params.principal_min) queryParams.append("principal_min", params.principal_min);
            if (params.principal_max) queryParams.append("principal_max", params.principal_max);
            if (params.limit) queryParams.append("limit", params.limit);
            if (params.offset) queryParams.append("offset", params.offset);

            const response = await request(
                `${API_URL}Branch/branch_loans/?${queryParams.toString()}`,
                "GET",
                null,
                headers()
            );

            return response;
        } catch (error) {
            return rejectWithValue(error.message || "Failed to fetch loans");
        }
    }
);

export const fetchOutstandingLoans = createAsyncThunk(
    "loans/fetchOutstandingLoans",
    async (params, { rejectWithValue }) => {
        try {
            const { request } = useHttp();
            const queryParams = new URLSearchParams();

            if (params.branch) queryParams.append("branch", params.branch);
            if (params.direction) queryParams.append("direction", params.direction);

            const response = await request(
                `${API_URL}Branch/branch_loans/outstanding/?${queryParams.toString()}`,
                "GET",
                null,
                headers()
            );

            return response;
        } catch (error) {
            return rejectWithValue(error.message || "Failed to fetch outstanding loans");
        }
    }
);

export const createLoan = createAsyncThunk(
    "loans/createLoan",
    async (loanData, { rejectWithValue }) => {
        try {
            const { request } = useHttp();
            const response = await request(
                `${API_URL}Branch/branch_loans/create/`,
                "POST",
                JSON.stringify(loanData),
                headers()
            );

            return response;
        } catch (error) {
            return rejectWithValue(error.message || "Failed to create loan");
        }
    }
);


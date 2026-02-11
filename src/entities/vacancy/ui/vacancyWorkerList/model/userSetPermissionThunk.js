import { createAsyncThunk } from "@reduxjs/toolkit";
import { API_URL, useHttp, headers } from "../../../../../shared/api/base";

export const userSetPermissionThunk = createAsyncThunk(
    'userSetPermissionSlice/userSetPermissionThunk',
    async (res, { rejectWithValue }) => {
        const { request } = useHttp();
        try {
            const response = await request(
                `${API_URL}Permissions/add_permissions_managers_and_directors/`,
                "POST",
                JSON.stringify(res),
                headers()
            );
            return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);




import {createAsyncThunk} from "@reduxjs/toolkit";
import {API_URL, headers, useHttp} from "shared/api/base";

export const fetchBranchesByLocationsThunk = createAsyncThunk(
    'branchSwitcherSlice/fetchBranchesByLocationsThunk',
    async (location) => {
        const {request} = useHttp();
        const response = await request(
            `${API_URL}Permissions/user_branchs/${location}/`,
            "GET",
            null,
            headers()
        );
        return response
    }
);

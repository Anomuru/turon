import {createAsyncThunk} from "@reduxjs/toolkit";
import {API_URL, headers, useHttp} from "shared/api/base";



export const fetchBranchesByLocationThunk = createAsyncThunk(
    'userSetPermissionSlice/fetLocationsForBranchesThunk',
    async (selectedLocationIds, {rejectedWithValue}) => {
        const {request} = useHttp();
        const response = await request(
            `${API_URL}Permissions/user_branchs/${selectedLocationIds}`,
            "POST",
            JSON.stringify({locations: selectedLocationIds}),
            headers()
        );
        return response
    }
)
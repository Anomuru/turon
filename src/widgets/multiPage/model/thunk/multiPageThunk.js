import {createAsyncThunk} from "@reduxjs/toolkit";
import {API_URL, headers, useHttp} from "shared/api/base";

export const fetchMultiPageDataThunk = createAsyncThunk(
    'multiPageSlice/fetchMultiPageDataThunk',
    async (data) => {
        const {request} = useHttp();
        const response = await request(
            `${API_URL}Permissions/location_filters/`,
            "POST",
            JSON.stringify(data),
            headers()
        );
        return response
    }
);

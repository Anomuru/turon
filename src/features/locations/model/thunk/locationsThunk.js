import { createAsyncThunk } from "@reduxjs/toolkit";
import { API_URL, headers, useHttp } from "shared/api/base";
import { clearSelectedLocations } from "../slice/locationsSlice";

export const fetchLocationsThunk = createAsyncThunk(
    'locationsSlice/fetchLocationsThunk',
    async (userId, { rejectWithValue, dispatch }) => {
        const { request } = useHttp();
        try {


            const response = await request(
                `${API_URL}Permissions/user_locations/${userId}/`,
                "GET",
                null,
                headers()
            );



            return { list: response };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

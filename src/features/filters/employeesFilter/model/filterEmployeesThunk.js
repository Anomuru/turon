import {createAsyncThunk} from "@reduxjs/toolkit";
import {API_URL, headers, useHttp} from "shared/api/base";

export const fetchFilteredEmployees = createAsyncThunk(
    "filterEmployees/fetchFilteredEmployees",
    async (filterObj) => {
        const {request} = useHttp()
        return await request(
            `${API_URL}`,
            "POST",
            JSON.stringify(filterObj),
            headers()
        )
    }
)
import {createAsyncThunk} from "@reduxjs/toolkit";
import {API_URL, useHttp} from "shared/api/base";

export const fetchUserData = createAsyncThunk(
    "user/fetchUserData",
    async (refresh_token) => {
        const {request} = useHttp()
        const headers = {
            "Authorization": "Bearer " + refresh_token,
            'Content-Type': 'application/json'
        }
        return request(`${API_URL}`, "GET", null, headers)
    }
)
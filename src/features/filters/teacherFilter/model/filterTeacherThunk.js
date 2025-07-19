import {createAsyncThunk} from "@reduxjs/toolkit";
import {API_URL, headers, useHttp} from "shared/api/base";

export const fetchTeachersFilter = createAsyncThunk(
    "filterTeacher/fetchTeachersFilter",
    async (resultObj) => {
        const {request} = useHttp()
        return await request(
            `${API_URL}`,
            "POST",
            JSON.stringify(resultObj),
            headers()
        )
    }
);
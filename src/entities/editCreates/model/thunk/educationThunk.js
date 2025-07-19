import {createAsyncThunk} from "@reduxjs/toolkit";
import {API_URL, headers, useHttp} from "../../../../shared/api/base";

export const getEducationThunk = createAsyncThunk(
    "getEducationSlice/getEducationThunk",
    async () => {
        const {request} = useHttp()
        return await request(`${API_URL}Language/language/` , "GET", null, headers())
    }
)

export const getEducationChange = createAsyncThunk(
    "getEducationSlice/getEducationChange",
    async ({data , id}) => {
        const {request} = useHttp()
        return await request(`${API_URL}Language/language/${id}/` , "PATCH", JSON.stringify(data), headers())
    }
)
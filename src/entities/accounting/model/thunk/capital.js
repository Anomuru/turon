import {createAsyncThunk} from "@reduxjs/toolkit";
import {API_URL, headers, ParamUrl, useHttp} from "../../../../shared/api/base";

export const capitalListThunk = createAsyncThunk(
    "capitalList/capitalListThunk",
    async ({branch, limit, offset , search}) => {
        const {request} = useHttp()
        return await request(`${API_URL}Capital/old_capital_list/?${ParamUrl({branch, limit, offset, status:"False" , search})}` , "GET" , null , headers())
    }
)

export const capitalDeletedListThunk = createAsyncThunk(
    "capitalList/capitalDeletedListThunk",
    async ({branch, limit, offset , search}) => {
        const {request} = useHttp()
        return await request(`${API_URL}Capital/old_capital_list/?${ParamUrl({branch, limit, offset, status:"True" , search})}` , "GET" , null , headers())
    }
)
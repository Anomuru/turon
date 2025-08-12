import {createAsyncThunk} from "@reduxjs/toolkit";
import {API_URL, headers, ParamUrl, useHttp} from "../../../../shared/api/base";

export const capitalListThunk = createAsyncThunk(
    "capitalList/capitalListThunk",
    async ({branch, limit, offset}) => {
        const {request} = useHttp()
        return await request(`${API_URL}Capital/old_capital_list/?${ParamUrl({branch, limit, offset, status:"False"})}` , "GET" , null , headers())
    }
)

export const capitalDeletedListThunk = createAsyncThunk(
    "capitalList/capitalDeletedListThunk",
    async (branchID) => {
        const {request} = useHttp()
        return await request(`${API_URL}Capital/old_capital_list/?status=True&branch=${branchID}` , "GET" , null , headers())
    }
)
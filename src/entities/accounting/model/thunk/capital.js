import {createAsyncThunk} from "@reduxjs/toolkit";
import {API_URL, headers, useHttp} from "../../../../shared/api/base";

export const capitalListThunk = createAsyncThunk(
    "capitalList/capitalListThunk",
    async (branchId) => {
        const {request} = useHttp()
        return await request(`${API_URL}Capital/old_capital_list/?status=False&branch=${branchId.id}` , "GET" , null , headers())
    }
)

export const capitalDeletedListThunk = createAsyncThunk(
    "capitalList/capitalDeletedListThunk",
    async (branchID) => {
        const {request} = useHttp()
        return await request(`${API_URL}Capital/old_capital_list/?status=True&branch=${branchID.id}` , "GET" , null , headers())
    }
)
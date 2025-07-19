import {createAsyncThunk} from "@reduxjs/toolkit";
import {API_URL, headers, useHttp} from "shared/api/base";

export const getBranchThunk = createAsyncThunk(
    "getBranchSlice/getBranchThunk",
    async () =>{
        const {request} = useHttp()
        return await request(`${API_URL}Branch/branch_list/` , "GET" , null , headers())
    }
)


export const changeBranchName = createAsyncThunk(
    "getBranchSlice/changeBranchName",
    async ({data,id}) => {
        const {request} = useHttp()
        return await request(`${API_URL}Branch/branch_update/${id}/`, "PATCH", JSON.stringify(data), headers())
    }
)


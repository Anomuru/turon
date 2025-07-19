import {createAsyncThunk} from "@reduxjs/toolkit";
import {API_URL, headers, useHttp} from "../../../../shared/api/base";

export const  accountingThunk = createAsyncThunk(
    "accountingSlice/accountingThunk",
    async ({branchID}) =>{
        const {request} = useHttp()

        return await request(`${API_URL}Encashment/encashment/${branchID}/`,  "GET" , null , headers())
    }
)
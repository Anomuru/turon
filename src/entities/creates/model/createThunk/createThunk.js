import {createAsyncThunk} from "@reduxjs/toolkit";
import {API_URL, headers, useHttp} from "shared/api/base";


export const postCreateSystemThunk = createAsyncThunk(
    "postCreateSystem/postCreateSystem",
    async(data) => {
        const {request} = useHttp();
        return await request(`${API_URL}System/systems/create/` , "POST" , JSON.stringify(data) , headers())
    }
)



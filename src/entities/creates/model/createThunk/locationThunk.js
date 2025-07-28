import {createAsyncThunk} from "@reduxjs/toolkit";
import {API_URL, headers, useHttp} from "shared/api/base";


export const createLocationThunk = createAsyncThunk(
    "postCreateLocation/createLocationThunk",
    async(res) => {
        const {request} = useHttp();
        return await request(`${API_URL}Location/location_create/` , "POST" , JSON.stringify(res) , headers())
    }
)

import {createAsyncThunk} from "@reduxjs/toolkit";
import {API_URL, headers, useHttp} from "shared/api/base.js";


export const fetchGroupObserve = createAsyncThunk(
    "groupObserveSlice/fetchGroupObserve",
    async () => {
        const {request} = useHttp()
        return await request(`${API_URL}Observation/observation_info/` , "GET" , null , headers())
    }
)
export const fetchGroupObserveOption = createAsyncThunk(
    "groupObserveSlice/fetchGroupObserveOption",
    async () => {
        const {request} = useHttp()
        return await request(`${API_URL}Observation/observation_options/` , "GET" , null , headers())
    }
)
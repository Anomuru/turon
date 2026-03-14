import {createAsyncThunk} from "@reduxjs/toolkit";
import {API_URL, headers, useHttp} from "shared/api/base.js";

export const fetchParty = createAsyncThunk(
    "partySlice/fetchParty",
    async () => {
        const {request} = useHttp()
        return await request(`${API_URL}parties/parties/` , "GET" , null , headers())
    }
)

export const fetchPartyTask = createAsyncThunk(
    "partySlice/fetchPartyTask",
    async () => {
        const {request} = useHttp()
        return await request(`${API_URL}parties/party-tasks/` , "GET" , null , headers())
    }
)
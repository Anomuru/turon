import {createAsyncThunk} from "@reduxjs/toolkit";
import {API_URL, headers, useHttp} from "shared/api/base.js";

export const fetchParty = createAsyncThunk(
    "partySlice/fetchParty",
    async (branchId) => {
        const {request} = useHttp()
        return await request(`${API_URL}Parties/parties/?branch_id=${branchId}` , "GET" , null , headers())
    }
)

export const fetchPartyTask = createAsyncThunk(
    "partySlice/fetchPartyTask",
    async (branchId) => {
        const {request} = useHttp()
        return await request(`${API_URL}Parties/party-tasks/?branch_id=${branchId}` , "GET" , null , headers())
    }
)

export const fetchPartyCompetitions = createAsyncThunk(
    "partySlice/fetchPartyCompetitions",
    async (branchId) => {
        const {request} = useHttp()
        return await request(`${API_URL}Parties/competitions/?branch_id=${branchId}` , "GET" , null , headers())
    }
)
export const fetchPartyReyting = createAsyncThunk(
    "partySlice/fetchPartyReyting",
    async (branchId) => {
        const {request} = useHttp()
        return await request(`${API_URL}Parties/parties/rating/?branch_id=${branchId}` , "GET" , null , headers())
    }
)
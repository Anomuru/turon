import {createAsyncThunk} from "@reduxjs/toolkit";
import {API_URL, headers, useHttp} from "shared/api/base";


export const fetchFlows = createAsyncThunk(
    "flowsSlice/fetchFlows",
    async (userBranchId) => {
        const {request} = useHttp()
        return await request(`${API_URL}Flow/flow-list/?branch=${userBranchId}`, "GET", null, headers())
    }
)

export const fetchFilterFlow = createAsyncThunk(
    "flowsSlice/fetchFilterFlow",
    ({subject, teacher}) => {
        const {request} = useHttp()
        return request(`${API_URL}Flow/flow-list/?subject=${subject}&teacher=${teacher}`, "GET", null, headers())
    }
)

export const fetchFilterFlows = createAsyncThunk(
    "flowsSlice/fetchFilterFlows",
    () => {
        const {request} = useHttp()
        return request(`${API_URL}`, "GET", null, headers())
    }
)


export const flowListThunk = createAsyncThunk(
    "flowsSlice/flowListThunk",
    async ({data}) => {
        const {request} = useHttp()
        return await request(`${API_URL}Flow/flow-list-create/`, "POST", JSON.stringify(data), headers())
    }
)

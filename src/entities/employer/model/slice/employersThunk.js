import {createAsyncThunk} from "@reduxjs/toolkit";
import {API_URL, branchQuery, headers, useHttp} from "shared/api/base";


export const fetchEmployersData = createAsyncThunk(
    "employersSlice/fetchEmployersData",
    async ({branch}) => {
        const {request} = useHttp()
        return request(`${API_URL}Users/employeers/?branch=${branch}`,"GET", null, headers())
    }
)

export const fetchEmployersDataWithFilter = createAsyncThunk(
    "employersSlice/fetchEmployersDataWithFilter",
    async ({jobId, fromAgeId, untilageId, langId}) => {
        const {request} = useHttp()
        return request(`${API_URL}Users/employeers/?job=${jobId}&age=${fromAgeId}-${untilageId}&language=${langId}`,"GET", null, headers())
    }
)


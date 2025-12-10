import {createAsyncThunk} from "@reduxjs/toolkit";
import {API_URL, branchQuery, headers, ParamUrl, useHttp} from "shared/api/base";


export const fetchEmployersData = createAsyncThunk(
    "employersSlice/fetchEmployersData",
    async ({branch, job, age, language, deleted, offset, limit, level}) => {
        const {request} = useHttp()
        return request(`${API_URL}Users/employeers/?${ParamUrl({
            branch,
            job,
            age,
            language,
            deleted,
            offset,
            limit,
            level
        })}`, "GET", null, headers())
    }
)

export const fetchEmployersDataWithoutPagination = createAsyncThunk(
    "employersSlice/fetchEmployersDataWithoutPagination",
    async ({branch, level}) => {
        const {request} = useHttp()
        return request(`${API_URL}Users/employeers/?${ParamUrl({
            branch,
            level
        })}`, "GET", null, headers())
    }
)


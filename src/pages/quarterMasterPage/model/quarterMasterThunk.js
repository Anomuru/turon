import { createAsyncThunk } from "@reduxjs/toolkit";
import { API_URL, headers, ParamUrl, useHttp } from "shared/api/base";

export const fetchQuarterMasterData = createAsyncThunk(
    "quarterMasterSlice/fetchQuarterMasterData",
    ({branch_id, status}) => {
        const {request} = useHttp()
        return request(`${API_URL}Teachers/teacher-requests/?${ParamUrl({branch_id, status})}`, "GET", null, headers())
    }
)


import {createAsyncThunk} from "@reduxjs/toolkit";
import {API_URL, headers, ParamUrl, useHttp} from "../../../../shared/api/base";

export const getOverheadType = createAsyncThunk(
    "overHeadSlice/getOverheadType",
    async () => {
        const {request} = useHttp()
        return await request(`${API_URL}Overhead/overheads_type/`, "GET", null, headers())
    }
)

export const getMonthDay = createAsyncThunk(
    "overHeadSlice/getMonthDay",
    async () => {
        const {request} = useHttp()

        return await request(`${API_URL}Overhead/month-days/`, "GET", null, headers())
    }
)

export const overHeadList = createAsyncThunk(
    "overHeadSlice/overHeadList",
    async ({branch, type, limit, offset ,search}) => {
        const {request} = useHttp()
        return await request(`${API_URL}Overhead/overheads/?${ParamUrl({
            status: "False",
            branch,
            type,
            limit,
            offset,
            search
        })}`, "GET", null, headers())
    }
)

export const overHeadDeletedList = createAsyncThunk(
    "overHeadSlice/overHeadDeletedList",
    async ({branch, type, limit, offset , search}) => {
        const {request} = useHttp()
        return await request(`${API_URL}Overhead/overheads/?${ParamUrl({
            status: "True",
            branch,
            type,
            limit,
            offset,
            search
        })}`, "GET", null, headers())
    }
)
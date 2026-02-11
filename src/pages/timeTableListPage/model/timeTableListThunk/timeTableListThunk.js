import {createAsyncThunk} from "@reduxjs/toolkit";
import {API_URL, headers, useHttp} from "shared/api/base";

export const fetchTimeTableListData = createAsyncThunk(
    "TimeTableSlice/fetchTimeTableListData",
    async ({pageSize , currentPage , search}) => {
        const {request} = useHttp()
        return request(`${API_URL}SchoolTimeTable/hours-list-create/${pageSize ? `?offset=${(currentPage - 1) * pageSize}&limit=${pageSize}` : ""}&search=${search}`, "GET", null)
    }
)

export const createTimeTable = createAsyncThunk(
    "TimeTableSlice/createTimeTable",
    async (obj) => {
        const {request} = useHttp()
        return request(`${API_URL}SchoolTimeTable/hours-list-create/`, "POST", JSON.stringify(obj))
    }
)

export const updateTimeTable = createAsyncThunk(
    "TimeTableSlice/updateTimeTable",
    async ({id, obj}) => {
        const {request} = useHttp()
        return request(`${API_URL}SchoolTimeTable/hours-list-update/${id}`, "PATCH", JSON.stringify(obj), headers())
    }
)

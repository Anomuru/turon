import {createAsyncThunk} from "@reduxjs/toolkit";
import {API_URL, headers, useHttp} from "shared/api/base";

export const fetchTimeTableListData = createAsyncThunk(
    "timeTable/fetchTimeTableListData",
    async () => {
        const {request} = useHttp()
        return request(`${API_URL}SchoolTimeTable/hours-list-create/`, "GET", null)
    }
)

export const createTimeTable = createAsyncThunk(
    "timeTable/createTimeTable",
    async (obj) => {
        const {request} = useHttp()
        return request(`${API_URL}SchoolTimeTable/hours-list-create/`, "POST", JSON.stringify(obj))
    }
)

export const updateTimeTable = createAsyncThunk(
    "timeTable/updateTimeTable",
    async ({id, obj}) => {
        const {request} = useHttp()
        return request(`${API_URL}SchoolTimeTable/hours-list-update/${id}`, "PATCH", JSON.stringify(obj))
    }
)

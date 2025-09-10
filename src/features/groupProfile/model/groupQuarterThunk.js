import {createAsyncThunk} from "@reduxjs/toolkit";
import {API_URL, headers, useHttp} from "shared/api/base.js";

export const fetchTerm = createAsyncThunk(
    "groupQuarterSlice/fetchTerm",
    async (id) => {
        const {request} = useHttp()
        return await request(`${API_URL}terms/list-term/${id}/`, "GET", null, headers())

    }
)
export const fetchTermData = createAsyncThunk(
    "groupQuarterSlice/fetchTermData",
    async ({termId , branchId}) => {
        const {request} = useHttp()
        return await request(`${API_URL}terms/list-test/${termId}/${branchId}/`, "GET", null, headers())

    }
)
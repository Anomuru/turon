import {createAsyncThunk} from "@reduxjs/toolkit";
import {API_URL, useHttp} from "shared/api/base.js";


export const fetchParentList = createAsyncThunk(
    "parentSlice",
    async (id) => {
        const {request} = useHttp()

        return await request(`${API_URL}parents/list/${id}/`)

    }
)
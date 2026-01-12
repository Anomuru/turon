import {createAsyncThunk} from "@reduxjs/toolkit";
import {API_URL, useHttp} from "shared/api/base.js";


export const fetchParentList = createAsyncThunk(
    "parentSlice",
    async ({branchId , deleted}) => {
        const {request} = useHttp()

        return await request(`${API_URL}parents/list/${branchId}/?deleted=${deleted}`)

    }
)
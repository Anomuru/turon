import {createAsyncThunk} from "@reduxjs/toolkit";
import {API_URL, headers, useHttp} from "shared/api/base.js";


export const fetchParentInfo = createAsyncThunk(
    "parentsProfileSlice/fetchParentInfo",
    async (id) => {
        const {request} = useHttp()
        return await request(`${API_URL}parents/detail/${id}/`, "GET", null, headers())
    }
)

export const fetchParentsAvailableStudents = createAsyncThunk(
    "parentsProfileSlice/fetchParentsAvailableStudents",
    async ({id, currentPage, pageSize, search}) => {
        const {request} = useHttp()
        return await request(`${API_URL}parents/${id}/available_students/?limit=${pageSize}&offset=${(currentPage - 1) * pageSize}&search=${search}`, "GET", null, headers())
    }
)


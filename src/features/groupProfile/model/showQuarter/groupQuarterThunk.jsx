
import {createAsyncThunk} from "@reduxjs/toolkit";
import {API_URL, headers, useHttp} from "shared/api/base.js";

export const fetchAcademicYear = createAsyncThunk(
    "groupQuarterShowSlice/fetchAcademicYear",
    async () => {

        const {request} = useHttp()

        return await request(`${API_URL}terms/education-years/` , "GET" , null , headers())
    }
)
export const fetchAcademicTerm = createAsyncThunk(
    "groupQuarterShowSlice/fetchAcademicTerm",
    async (id) => {

        const {request} = useHttp()

        return await request(`${API_URL}terms/list-term/${id}/` , "GET" , null , headers())
    }
)
export const fetchAcademicData = createAsyncThunk(
    "groupQuarterShowSlice/fetchAcademicData",
    async ({termId , academicYear , groupId}) => {

        const {request} = useHttp()

        return await request(`${API_URL}terms/terms-by-group/${groupId}/${termId}/` , "GET" , null , headers())
    }
)
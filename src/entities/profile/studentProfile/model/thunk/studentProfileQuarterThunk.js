import {createAsyncThunk} from "@reduxjs/toolkit";
import {API_URL, headers, useHttp} from "shared/api/base.js";

export const fetchAcademicYear = createAsyncThunk(
    "studentQuarterShowSlice/fetchAcademicYear",
    async () => {

        const {request} = useHttp()

        return await request(`${API_URL}terms/education-years/` , "GET" , null , headers())
    }
)
export const fetchAcademicTerm = createAsyncThunk(
    "studentQuarterShowSlice/fetchAcademicTerm",
    async (id) => {

        const {request} = useHttp()

        return await request(`${API_URL}terms/list-term/${id}/` , "GET" , null , headers())
    }
)
export const fetchAcademicData = createAsyncThunk(
    "studentQuarterShowSlice/fetchAcademicData",
    async ({termId , academicYear , groupId}) => {

        const {request} = useHttp()

        return await request(`${API_URL}terms/terms-by-student/${groupId}/${termId}/` , "GET" , null , headers())
    }
)
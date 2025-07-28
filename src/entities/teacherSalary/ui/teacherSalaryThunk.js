import {createAsyncThunk} from "@reduxjs/toolkit";
import {API_URL, useHttp, headers} from "../../../shared/api/base";


export const fetchTeacherSalaryThunk = createAsyncThunk(
    "teacherSalarySlice/fetchTeacherSalaryThunk",
    async (id) => {
        const {request} = useHttp();
        return await request(`${API_URL}Teachers/teacher-salary-list/${id}/`, "GET", null, headers())
    }
)


export const fetchUpdateTeacherSalaryThunk = createAsyncThunk(
    "teacherSalarySlice/fetchUpdateTeacherSalaryThunk",
    async (id) => {
        const {request} = useHttp();
        return await request(`${API_URL}Teachers/teacher-salary-list/${id}/`, "GET", null, headers())
    }
)

export const fetchTeacherSalaryIdThunk = createAsyncThunk(
    "teacherSalarySlice/fetchTeacherSalaryIdThunk",
    async (id) => {
        const {request} = useHttp();
        return await request(`${API_URL}Teachers/teacher-salary-list-month/${id}/?status=False`, "GET", null, headers())
    }
)
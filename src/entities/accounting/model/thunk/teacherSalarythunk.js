import {createAsyncThunk} from "@reduxjs/toolkit";
import {API_URL, headers, ParamUrl, useHttp} from "../../../../shared/api/base";

export const getTeacherSalary = createAsyncThunk(
    "teacherSalary/getTeacherSalary",
    async ({branch, limit, offset , search}) => {
        const {request} = useHttp()
        return await request(`${API_URL}Teachers/teacher-salary-list/?${ParamUrl({
            status: "False",
            branch,
            limit,
            offset,
            search
        })}`, "GET", null, headers())
    }
)

export const getDeletedTeacherSalary = createAsyncThunk(
    "teacherSalary/getDeletedTeacherSalary",
    async ({branch, limit, offset , search}) => {
        const {request} = useHttp()
        return await request(`${API_URL}Teachers/teacher-salary-list/?${ParamUrl({
            status: "True",
            branch,
            limit,
            offset,
            search
        })}`, "GET", null, headers())
    }
)

export const changePaymentType = createAsyncThunk(
    "teacherSalary/changePaymentType",
    async () => {
        const {request} = useHttp()
    }
)
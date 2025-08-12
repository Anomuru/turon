import {createAsyncThunk} from "@reduxjs/toolkit";
import {API_URL, headers, ParamUrl, useHttp} from "../../../../shared/api/base";

export const getTeacherSalary = createAsyncThunk(
    "teacherSalary/getTeacherSalary",
    async ({branch, limit, offset}) => {
        const {request} = useHttp()
        return await request(`${API_URL}Teachers/teacher-salary-list/?${ParamUrl({
            status: "False",
            branch,
            limit,
            offset
        })}`, "GET", null, headers())
    }
)

export const getDeletedTeacherSalary = createAsyncThunk(
    "teacherSalary/getDeletedTeacherSalary",
    async (branchID) => {
        const {request} = useHttp()
        return await request(`${API_URL}Teachers/teacher-salary-list/?status=True&branch=${branchID}`, "GET", null, headers())
    }
)

export const changePaymentType = createAsyncThunk(
    "teacherSalary/changePaymentType",
    async () => {
        const {request} = useHttp()
    }
)
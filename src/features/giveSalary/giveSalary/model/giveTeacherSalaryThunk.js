import {createAsyncThunk} from "@reduxjs/toolkit";
import {API_URL, headers, useHttp} from "shared/api/base";

export const giveTeacherSalaryThunk = createAsyncThunk(
    'giveTeacherSalarySlices/giveTeacherSalaryThunk',
    async (newSalary, { rejectWithValue }) => {
            const {request} = useHttp()
            const response = await request(`${API_URL}Teachers/teachers/salary/create/`, "POST", JSON.stringify(newSalary), headers());

    }
)
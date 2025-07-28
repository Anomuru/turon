import {createAsyncThunk} from "@reduxjs/toolkit";
import {API_URL, useHttp, headers} from "../../../shared/api/base";

export const fetchEmployerSalaryThunk = createAsyncThunk(
    "giveEmployerSalarySlice/fetchEmployerSalaryThunk",
    async (id) => {
        const {request} = useHttp()
        return await  request(`${API_URL}Users/salaries/${id}/?status=False`, "GET", null, headers())
    }
)
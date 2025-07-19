import {createAsyncThunk} from "@reduxjs/toolkit";
import {API_URL, useHttp, headers} from "../../../shared/api/base";


export const  fetchEmployerSalaryThunk = createAsyncThunk(
    "employerSalarySlice/fetchEmployerSalaryThunk",
    async (id) => {
        const {request} = useHttp();
        return await  request(`${API_URL}Users/user-salary/${id}/`, "GET", null, headers())
    }
)
import {createAsyncThunk} from "@reduxjs/toolkit";
import {API_URL, useHttp, headers} from "shared/api/base";


export const employerSalaryDeleteThunk = createAsyncThunk(
    'employerSalaryDeleteSlice/employerSalaryDeleteThunk',
    async (id) => {
        const {request} = useHttp();
        await request(`${API_URL}Users/salaries/delete/${id}/`, "DELETE",null, headers())
        return id;
    }
)
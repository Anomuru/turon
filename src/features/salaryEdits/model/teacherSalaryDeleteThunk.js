import {createAsyncThunk} from "@reduxjs/toolkit";
import {API_URL, useHttp, headers} from "../../../shared/api/base";


export const teacherSalaryDeleteThunk = createAsyncThunk(
    'teacherSalaryDeleteSlice/teacherSalaryDeleteThunk',
    async (id) => {
        const {request} = useHttp();
        await request(`${API_URL}Teachers/teachers/salary/delete/${id}/`, "DELETE",null, headers())
        return id;
    }
)
import {createAsyncThunk} from "@reduxjs/toolkit";
import {API_URL, headers, useHttp} from "../../../shared/api/base";



export const schoolTeacherDayThunk = createAsyncThunk(
    'schoolTeacherDaySlice/schoolTeacherDayThunk',
    async ({id, data}) => {
        const {request} = useHttp()
        return await request(`${API_URL}Teachers/teachers/salary/update_patch/${id}/`, "PATCH", JSON.stringify(data), headers())
    }
)
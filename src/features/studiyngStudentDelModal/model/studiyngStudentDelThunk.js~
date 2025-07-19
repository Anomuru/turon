import {createAsyncThunk} from "@reduxjs/toolkit";
import {API_URL, headers, useHttp} from "../../../shared/api/base";


export const studiyngStudentDelThunk = createAsyncThunk(
    'studiyngStudentDelSlice/studiyngStudentDelThunk',
    async (id) => {
        const {request} = useHttp();
        return await request(`${API_URL}Students/students_delete/${id}/`, "DELETE", null, headers())
    }
)
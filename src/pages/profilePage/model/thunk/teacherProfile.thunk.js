import {createAsyncThunk} from "@reduxjs/toolkit";
import {API_URL, headers, useHttp} from "shared/api/base";

export const fetchTeacherProfileData = createAsyncThunk(
    "TeacherProfileSlice/fetchTeacherProfileData",
    async (id) => {
        const {request} = useHttp()
        return request(`${API_URL}Teachers/teachers/${id}/`, "GET", null, headers())
    }
)
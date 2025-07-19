import {createAsyncThunk} from "@reduxjs/toolkit";
import {API_URL, headers, headersImg, useHttp} from "../../../../shared/api/base";

export const fetchEmployerId = createAsyncThunk(
    "employerParseSlice/fetchTeacherId",
    async (id) => {
        const {request} = useHttp();
        return await request(`${API_URL}Users/employers/${id}/`, "GET", null, headers())
    }
)

export const editEmployerThunk = createAsyncThunk (
    "employerEditSlice/editTeacherThunk",
    async ({id, updateEmployer}) => {
        const {request} = useHttp();
        return await request(`${API_URL}Users/users/update/${id}/`, "PATCH", JSON.stringify(updateEmployer), headers())
    }
)

export const changeEmployerProfileImage = createAsyncThunk(
    "employerParseSlice/changeTeacherProfileImage",
    async ({id, data}) => {
        const formData = new FormData
        formData.append("profile_img", data)
        const {request} = useHttp()
        return request(`${API_URL}Users/users/update/${id}/`, "PATCH", formData, headersImg())
    }
)
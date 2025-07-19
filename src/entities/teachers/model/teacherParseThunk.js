import {createAsyncThunk} from "@reduxjs/toolkit";
import {API_URL, useHttp, headers, headersImg} from "../../../shared/api/base";

export const fetchTeacherId = createAsyncThunk(
    "teacherParseSlice/fetchTeacherId",
    async (id) => {
        const {request} = useHttp();
        return await request(`${API_URL}Teachers/teachers/${id}/`, "GET", null, headers())
    }
)

export const editTeacherThunk = createAsyncThunk (
    "teacherEditSlice/editTeacherThunk",
    async ({id, updateTeacher}) => {
        const {request} = useHttp();
        return await request(`${API_URL}Teachers/teachers/update/${id}/`, "PATCH", JSON.stringify(updateTeacher), headers())
    }
)

export const changeTeacherProfileImage = createAsyncThunk(
    "teacherParseSlice/changeTeacherProfileImage",
    async ({id, data}) => {
        const formData = new FormData
        formData.append("profile_img", data)
        const {request} = useHttp()
        return request(`${API_URL}Users/users/update/${id}/`, "PATCH", formData, headersImg())
    }
)

export const fetchDropStudents = createAsyncThunk (
    "teacherEditSlice/fetchDropStudents",
    async ({id}) => {
        const {request} = useHttp();
        return await request(`${API_URL}Teachers/group-student/${id}/`, "GET", null, headers())
    }
)

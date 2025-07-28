import {createAsyncThunk} from "@reduxjs/toolkit";
import {API_URL, headers, headersImg, useHttp} from "shared/api/base";

export const fetchStudentProfileData = createAsyncThunk(
    "studentProfile/fetchStudentProfileData",
    async (id) => {
        const {request} = useHttp()
        return request(`${API_URL}Students/students/${id}/`, "GET", null, headers())
    }
)

export const changeStudentProfileData = createAsyncThunk(
    "studentProfile/changeStudentProfileData",
    async (obj) => {
        const {request} = useHttp()
        return request(`${API_URL}Students/students_update/${obj.id}/`, "PATCH", JSON.stringify(obj.res), headers())
    }
)

export const changeStudentProfileImage = createAsyncThunk(
    "studentProfile/changeStudentProfileImage",
    async ({id, data}) => {
        const formData = new FormData
        formData.append("profile_img", data)
        const {request} = useHttp()
        return request(`${API_URL}Users/users/update/${id}/`, "PATCH", formData, headersImg())
    }
)

export const fetchLanguagesStudentProfile = createAsyncThunk(
    'studentProfile/fetchLanguagesStudentProfile',
    async () => {
        const {request} = useHttp()
        return await request(`${API_URL}Language/language/`, "GET", null, headers())
    }
)


export const fetchClassNumberListStudentProfile = createAsyncThunk(
    "studentProfile/fetchClassNumberListStudentProfile",
    async ({branch}) => {
        const {request} = useHttp()
        return await request(`${API_URL}Class/class_number_list/?branch=${branch}`, "GET", null, headers())
    }
)


export const fetchStudentCharity = createAsyncThunk(
    "studentProfile/fetchStudentCharity",
    (id) => {
        const {request} = useHttp()
        return request(`${API_URL}Students/student_charities/${id}/` , "GET" , null , headers())
    }
)
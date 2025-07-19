import {createAsyncThunk} from "@reduxjs/toolkit";
import {API_URL, headers, headersImg, useHttp} from "shared/api/base";

export const fetchUserProfileData = createAsyncThunk(
    "userProfile/fetchUserProfileData",
    async (id) => {
        const {request} = useHttp()
        return await request(`${API_URL}Users/users/${id}/`, "GET", null, headers())
    }
)

export const changeUserProfileData = createAsyncThunk(
    "userProfile/changeUserProfileData",
    async ({id, data}) => {
        const {request} = useHttp()
        return await request(`${API_URL}Users/users/update/${id}/`, "PATCH", JSON.stringify(data), headers())
    }
)

export const changeUserProfileImage = createAsyncThunk(
    "userProfile/changeUserProfileImage",
    async ({id, data}) => {
        const {request} = useHttp()
        const formData = new FormData
        formData.append("profile_img", data)
        return request(`${API_URL}Users/users/update/${id}/`, "PATCH", formData, headersImg())
    }
)


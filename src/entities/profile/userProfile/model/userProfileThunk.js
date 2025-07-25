import {createAsyncThunk} from "@reduxjs/toolkit";
import {API_URL, headers, headersImg, useHttp} from "shared/api/base";

export const fetchUserProfileData = createAsyncThunk(
    "userProfile/fetchUserProfileData",
    async (id) => {
        const {request} = useHttp()
        return await request({url: `Users/users/${id}/`, headers: headers()})
    }
)

export const changeUserProfileData = createAsyncThunk(
    "userProfile/changeUserProfileData",
    async ({id, data}) => {
        const {request} = useHttp()
        return await request({
            url: `Users/users/update/${id}/`,
            method: "PATCH",
            body: JSON.stringify(data),
            headers: headers()
        })
    }
)

export const changeUserProfileImage = createAsyncThunk(
    "userProfile/changeUserProfileImage",
    async ({id, data}) => {
        const {request} = useHttp()
        const formData = new FormData
        formData.append("profile_img", data)
        return request({url: `Users/users/update/${id}/`, method: "PATCH", body: formData, headers: headersImg()})
    }
)


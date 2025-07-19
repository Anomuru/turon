import {createAsyncThunk} from "@reduxjs/toolkit";
import {API_URL, headers, useHttp} from "shared/api/base";

export const fetchRgbData = createAsyncThunk(
    "rgbSlice/fetchRgbData",
    ({branch}) => {
        const {request} = useHttp()
        return request(`${API_URL}Students/student-school-list/?branch=${branch}`, "GET", null, headers())
    }
)

import {createAsyncThunk} from "@reduxjs/toolkit";
import {API_URL, headers, useHttp} from "shared/api/base";

export const fetchVacancyData = createAsyncThunk(
    "vacancyPageParseSlice/fetchVacancyData",
    async (id) => {
        const {request} = useHttp()
        return request(`${API_URL}Permissions/jobs/`, "GET", null, headers())
    }
)
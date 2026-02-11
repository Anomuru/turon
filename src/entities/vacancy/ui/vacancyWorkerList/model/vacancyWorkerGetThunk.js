import {createAsyncThunk} from "@reduxjs/toolkit";
import {API_URL, useHttp, headers} from "../../../../../shared/api/base";

export const vacancyWorkerGetThunk = createAsyncThunk(
    'vacancyWorkerSoucre/vacancyWorkerGetThunk',
    async () => {
        const {request} = useHttp()
        return await request(`${API_URL}Permissions/add_permissions_managers_and_directors/`, "GET", null, headers())
    }
)


import {createAsyncThunk} from "@reduxjs/toolkit";
import {API_URL, useHttp, headers} from "../../../../shared/api/base";

export  const fetchWorkerWithId = createAsyncThunk(
    'vacancyWorkPageSlice/fetchWorkerWithId',
    async (id) => {
        const {request} = useHttp();
        return await request(`${API_URL}Permissions/job_profile/${id}`, "GET", null, headers())
    }
)
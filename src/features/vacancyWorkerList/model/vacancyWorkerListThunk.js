import {createAsyncThunk} from "@reduxjs/toolkit";
import {API_URL, headers, useHttp} from "../../../shared/api/base";


export const vacancyWorkerListThunk = createAsyncThunk(
    'vacancyWorkerSlice/vacancyWorkerListThunk',
    async (id, { rejectWithValue }) => {
        const {request} = useHttp();
        try {
            const response = await request(`${API_URL}Users/users-job/`, "POST", JSON.stringify(id), headers());
            return response;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

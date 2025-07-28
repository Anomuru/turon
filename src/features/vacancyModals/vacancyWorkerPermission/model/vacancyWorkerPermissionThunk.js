import {createAsyncThunk} from "@reduxjs/toolkit";
import {API_URL, headers, useHttp} from "../../../../shared/api/base";


export const fetchPermissionTable = createAsyncThunk(
    'vacancyWorkerPermissionSlice/fetchPermissionTable',
    async () => {
        const {request} = useHttp()
        return await request(`${API_URL}Permissions/tables/`, "GET", null, headers())
    }
)

export const postSelectedTable = createAsyncThunk(
    'vacancyWorkerPermissionSlice/postSelectedTable',
    async (selectedTable, {rejectWithValue}) => {
        const {request} = useHttp();
        try {
            const response = await request(
                `${API_URL}Permissions/tables/`,
                "POST",
                JSON.stringify({table: selectedTable}),
                headers()
            );
            return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);


export const selectedPermissionTable = createAsyncThunk(
    'vacancyWorkerPermissionSlice/postSelectedTable',
    async (id) => {
        const {request} = useHttp()
        return await request(`${API_URL}Permissions/job_profile/${id}`, "POST", JSON.stringify({"permissions": {id}}) , headers())
    }
)





export const postSelectedPermission = createAsyncThunk(
    'vacancyWorkerPermissionSlice/postSelectedPermission',
    async ({ id, selectedTable, selectedPermissions, selectedJobID }) => {
        const { request } = useHttp();
        return await request(
            `${API_URL}Permissions/job_profile/${id}`,
            "POST",
            JSON.stringify({
                job_id: selectedJobID,
                permissions: selectedPermissions
            }),
            headers()
        );
    }
);


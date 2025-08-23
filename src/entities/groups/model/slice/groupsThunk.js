import {createAsyncThunk} from "@reduxjs/toolkit";
import {API_URL, branchQuery, headers, ParamUrl, useHttp} from "shared/api/base";









export const fetchGroupsDataWithFilter = createAsyncThunk(
    "groupsSlice/fetchGroupsDataWithFilter",
    async({userBranchId, teacherId,deleted , currentPage , pageSize})  =>{
        const {request} = useHttp()
        return await request(`${API_URL}Group/classes/?branch=${userBranchId}${teacherId ? `&teacher=${teacherId}` : ""}&deleted=${deleted ? "True" : "False"}${pageSize ? `&offset=${(currentPage - 1) * pageSize}&limit=${pageSize}` : ""}`, "GET", null, headers())
    }
)

export const fetchClassesDataForFlow = createAsyncThunk(
    "groupsSlice/fetchClassesDataForFlow",
    async({branch})  =>{
        const {request} = useHttp()
        return await request(`${API_URL}Group/classes2/?${ParamUrl({branch, deleted: "False"})}`, "GET", null, headers())
    }
)


export const fetchGroupTypeThunk = createAsyncThunk(
    "groupsSlice/fetchGroupTypeThunk",
    async () => {
        const {request} = useHttp()
        return await  request(`${API_URL}Group/course_types/`, "GET", null, headers())
    }
)



import {createAsyncThunk} from "@reduxjs/toolkit";
import {API_URL, branchQuery, headers, useHttp} from "shared/api/base";









export const fetchGroupsDataWithFilter = createAsyncThunk(
    "groupsSlice/fetchGroupsDataWithFilter",
    async({userBranchId, teacherId, subjId, typeId, fromId, untilId , deleted})  =>{
        const {request} = useHttp()
        return await request(`${API_URL}Group/classes/?branch=${userBranchId}${teacherId ? `&teacher=${teacherId}` : ""}&deleted=${deleted ? "True" : "False"}`, "GET", null, headers())
    }
)


export const fetchGroupTypeThunk = createAsyncThunk(
    "groupsSlice/fetchGroupTypeThunk",
    async () => {
        const {request} = useHttp()
        return await  request(`${API_URL}Group/course_types/`, "GET", null, headers())
    }
)



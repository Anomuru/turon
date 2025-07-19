import {createAsyncThunk} from "@reduxjs/toolkit";
import {API_URL, branchQuery, headers, useHttp} from "shared/api/base";


export const fetchTeachersData = createAsyncThunk(
    "teachersSlice/fetchTeachersData",
    async ({userBranchId}) =>{
        const {request} = useHttp()
        return await request(`${API_URL}Teachers/teachers/?branch=${userBranchId}&deleted=False` , "GET" , null , headers())
    }
)


export const fetchDeletedTeachersData = createAsyncThunk(
    "teachersSlice/fetchDeletedTeachersData",
    async ({userBranchId}) =>{
        const {request} = useHttp()
        return await request(`${API_URL}Teachers/teachers/?branch=${userBranchId}&deleted=True` , "GET" , null , headers())
    }
)

export const fetchTeachersDataWithFilter = createAsyncThunk(
    "teachersSlice/fetchTeachersDataWithFilter",
    async ({userBranchId, fromAge, untilAge, subjId, langId}) =>{
        const {request} = useHttp()
        return await request(`${API_URL}Teachers/teachers/?subject=${subjId}&age=${fromAge}-${untilAge}&language=${langId}` , "GET" , null , headers())
    }
)


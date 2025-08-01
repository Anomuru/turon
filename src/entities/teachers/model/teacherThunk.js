import {createAsyncThunk} from "@reduxjs/toolkit";
import {API_URL, branchQuery, headers, useHttp} from "shared/api/base";


const renderItem = ({subjId , fromAge , untilAge , langId , switchItem}) => {
    return `${subjId ? `&subject=${subjId}` : ""}${fromAge !== null && untilAge !== null ? `&age=${fromAge}-${untilAge}` : ""}${langId ? `&language=${langId}` : ""}&deleted=${switchItem === true ? "True" : "False"}`
}

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
    async ({userBranchId, fromAge, untilAge, subjId, langId , switchItem}) =>{
        const {request} = useHttp()
        return await request(`${API_URL}Teachers/teachers/?branch=${userBranchId}${renderItem({untilAge , subjId , fromAge , langId , switchItem})}` , "GET" , null , headers())
    }
)


import {createAsyncThunk} from "@reduxjs/toolkit";
import {API_URL, headers, useHttp} from "shared/api/base";
// move-to-flow/
export const fetchFlowProfileData = createAsyncThunk(
    "flowsProfileSlice/fetchFlowProfileData",
    async ({id}) =>{
        const {request} = useHttp()
        return await request(`${API_URL}Flow/flow-profile/${id}` , "GET" , null , headers())
    }
)

export const fetchFlowProfileNextLesson = createAsyncThunk(
    "flowsProfileSlice/fetchFlowProfileNextLesson",
    ({id}) => {
        const {request} = useHttp()
        return request(`${API_URL}TimeTable/check_group_next_lesson?id=${id}&type=flow`, "GET", null, headers())
    }
)

export const fetchFilteredStudents = createAsyncThunk(
    "flowsProfileSlice/fetchFilteredStudents",
    async ({flow, branch, res}) =>{
        const {request} = useHttp()
        return await request(`${API_URL}Flow/checked-students-for-time_table/?branch=${branch}&flow=${flow}` , "POST" , JSON.stringify(res) , headers())
    }
)

export const changeFlowProfile = createAsyncThunk(
    "flowsProfileSlice/addFlowStudents",
    async ({res, id}) =>{
        const {request} = useHttp()
        return await request(`${API_URL}Flow/flow-profile/${id}` , "PATCH" , JSON.stringify(res) , headers())
    }
)

export const moveFlow = createAsyncThunk(
    "flowsProfileSlice/moveFlow",
    async ({res, id, to_id}) =>{
        const {request} = useHttp()
        return await request(`${API_URL}Flow/move-to-flow/?flow_id=${id}&to_flow_id=${to_id}` , "POST" , JSON.stringify(res) , headers())
    }
)

export const fetchFilteredTeachers = createAsyncThunk(
    "flowsProfileSlice/fetchFilteredTeachers",
    async ({res, id, branch}) =>{
        const {request} = useHttp()
        return await request(`${API_URL}Flow/checked-teachers/?flow=${id}&branch=${branch}` , "POST" , JSON.stringify(res) , headers())
    }
)

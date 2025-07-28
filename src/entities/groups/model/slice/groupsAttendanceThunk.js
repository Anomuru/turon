import {createAsyncThunk} from "@reduxjs/toolkit";
import {API_URL, headers, useHttp} from "../../../../shared/api/base";



export const getAttendanceThunk  =createAsyncThunk(
    "groupAttendance/getAttendance",
    (id) => {
        const {request} = useHttp()

        return request(`${API_URL}Attendance/school-to-attend-days/${id}/` , "GET" , null , headers())
    }
)

// export const fetchAttendanceStudent = createAsyncThunk(
//     "groupAttendance/fetchAttendanceStudent",
//     ()=> {
//         const {request} = useHttp()
//         return request(`${API_URL}`)
//     }
// )

export const fetchGroupAttendend = createAsyncThunk(
    "groupAttendance/fetchGroupAttendend",
    (id) => {
        const {request} = useHttp()
        return request(`${API_URL}Attendance/attendance_list_school/${id}/`, "GET" , null , headers())

    }
)
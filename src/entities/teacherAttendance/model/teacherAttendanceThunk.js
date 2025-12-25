import {createAsyncThunk} from "@reduxjs/toolkit";
import {API_URL, headers, useHttp} from "shared/api/base.js";

export const fetchGroupsAttendance = createAsyncThunk(
    "teacherAttendanceSlice/fetchGroupsAttendance",
    ({userBranchId, year, month, day , id}) => {
        const {request} = useHttp()
        return request(`${API_URL}Teachers/teacher_attendance/${id}/?year=${+year}&month=${+month}`, "GET", null, headers())
    }
)

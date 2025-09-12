import {createAsyncThunk} from "@reduxjs/toolkit";
import {API_URL, headers, ParamUrl, useHttp} from "shared/api/base";

export const  fetchTimeTableWeekDays = createAsyncThunk(
    "TimeTableTuronSlice/fetchTimeTableWeekDays",
    async () => {
        const {request} = useHttp()
        return await  request(`${API_URL}TimeTable/week_days/`, "GET", null, headers())
    }
)


export const fetchTimeTableTypesData = createAsyncThunk(
    "TimeTableTuronSlice/fetchTimeTableTypesData",
    async ({type, branch}) => {
        const {request} = useHttp()
        return await  request(`${API_URL}SchoolTimeTable/timetable-class-flow/?branch=${branch}&type=${type}`, "GET", null, headers())
    }
)


export const fetchTimeTableData = createAsyncThunk(
    "TimeTableTuronSlice/fetchTimeTableData",
    async ({date, branch, week, teacher}) => {
        const {request} = useHttp()
        return await  request(`${API_URL}SchoolTimeTable/timetable-lessons/?${ParamUrl({date, branch, week, teacher})}`, "GET", null, headers())
    }
)

export const fetchTimeTableForShow = createAsyncThunk(
    "TimeTableTuronSlice/fetchTimeTableForShow",
    async ({branch, teacher, student, group}) => {
        const {request} = useHttp()
        return await  request(`${API_URL}SchoolTimeTable/timetable-lessons/?${ParamUrl({branch, teacher, student, group})}`, "GET", null, headers())
    }
)

export const fetchTimeTableSubject = createAsyncThunk(
    "TimeTableTuronSlice/fetchTimeTableSubject",
    async (id) => {
        const {request} = useHttp()
        return await  request(`${API_URL}Class/class-subjects/?group=${id}`, "GET", null, headers())
    }
)


export const fetchTimeTableTeacher = createAsyncThunk(
    "TimeTableTuronSlice/fetchTimeTableTeacher",
    async ({subject, branch}) => {
        const {request} = useHttp()
        return await  request(`${API_URL}Teachers/teachers-for-subject-time/?branch=${branch}&subject=${subject}`, "GET", null, headers())
    }
)

export const fetchTimeTableColors = createAsyncThunk(
    "TimeTableTuronSlice/fetchTimeTableColors",
    async () => {
        const {request} = useHttp()
        return await  request(`${API_URL}Class/class_colors/`, "GET", null, headers())
    }
)


export const fetchTimeTableClassView  = createAsyncThunk(
    "TimeTableTuronSlice/fetchTimeTableClassView",
    async ({date, branch, week, teacher}) => {
        const {request} = useHttp()
        return await  request(`${API_URL}SchoolTimeTable/timetable-lessons-class/?${ParamUrl({date, branch, week, teacher})}`, "GET", null, headers())
    }
)

export const fetchTimeTableStudents  = createAsyncThunk(
    "TimeTableTuronSlice/fetchTimeTableStudents",
    async ({time_table_id,subject_id, type, group_flow, date}) => {
        const {request} = useHttp()
        return await  request(`${API_URL}SchoolTimeTable/time_table_data_view/?${ParamUrl({time_table_id,subject_id, type, group_flow, date})}`, "GET", null, headers())
    }
)


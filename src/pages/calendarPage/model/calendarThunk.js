import {createAsyncThunk} from "@reduxjs/toolkit";
import {API_URL, headers, useHttp} from "shared/api/base";

export const fetchCalendarData = createAsyncThunk(
    "calendarSlice/fetchCalendarData",
    async ({current_year, next_year}) =>{
        const {request} = useHttp()
        return await request(`${API_URL}Calendar/get-calendar/${current_year}/${next_year}/`, "GET", null, headers())
    }
)

// export const changeDayType = createAsyncThunk(
//     "calendarSlice/changeDayType",
//     async (obj) => {
//         const {request} = useHttp()
//         return request(`${API_URL}Calendar/change-type/`, "POST", JSON.stringify(obj), headers())
//     }
// )

// export const deleteDayType = createAsyncThunk(
//     "calendarSlice/deleteDayType",
//     async (obj) => {
//         const {request} = useHttp()
//         return request(`${API_URL}Calendar/delete-type/`, "DELETE", JSON.stringify(obj), headers())
//     }
// )



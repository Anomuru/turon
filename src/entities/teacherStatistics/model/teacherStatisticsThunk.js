import {createAsyncThunk} from "@reduxjs/toolkit";
import {API_URL, headers, useHttp} from "shared/api/base.js";

export const fetchTeacherStatistics = createAsyncThunk(
    "teacherStatisticsSlice/fetchTeacherStatistics",
    async ({branch, date_from, date_to}) => {
        const {request} = useHttp();

        return await request(
            `${API_URL}Teachers/teacher-stat/?branch=${branch}&date_from=${date_from}&date_to=${date_to}`,
            "GET",
            null,
            headers()
        );
    }
);

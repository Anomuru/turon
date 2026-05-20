import {createAsyncThunk} from "@reduxjs/toolkit";
import {API_URL, headers, useHttp} from "shared/api/base.js";

export const fetchLessonPlanDailyReport = createAsyncThunk(
    "lessonPlanDailyReportSlice/fetchLessonPlanDailyReport",
    async ({branch_id, date}) => {
        const {request} = useHttp();

        return await request(
            `${API_URL}Lesson_plan/daily-report/?branch_id=${branch_id}&date=${date}`,
            "GET",
            null,
            headers()
        );
    }
);

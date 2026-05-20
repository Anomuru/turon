import {createAsyncThunk} from "@reduxjs/toolkit";
import {API_URL, headers, useHttp} from "shared/api/base.js";

export const fetchTeacherLessonPlans = createAsyncThunk(
    "teacherLessonPlansSlice/fetchTeacherLessonPlans",
    async ({teacher_id, start_date, end_date}) => {
        const {request} = useHttp();

        return await request(
            `${API_URL}Lesson_plan/teacher-plans/?teacher_id=${teacher_id}&start_date=${start_date}&end_date=${end_date}`,
            "GET",
            null,
            headers()
        );
    }
);

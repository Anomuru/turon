import { createAsyncThunk } from "@reduxjs/toolkit";
import { API_URL, headers, useHttp } from "../../../../shared/api/base";

export const fetchEducationQualityOverview = createAsyncThunk(
    "educationQuality/fetchOverview",
    async () => {
        const { request } = useHttp();
        return await request(`${API_URL}terms/education-quality/`, "GET", null, headers());
    }
);

export const fetchEducationQualityStatistics = createAsyncThunk(
    "educationQuality/fetchStatistics",
    async ({ termId, subjectId, classId, teacherId, branchId }) => {
        const { request } = useHttp();

        let url = `${API_URL}terms/education-quality/${termId}/`;
        const params = new URLSearchParams();

        if (subjectId) params.append('subject_id', subjectId);
        if (classId) params.append('class_id', classId);
        if (teacherId) params.append('teacher_id', teacherId);
        if (branchId) params.append("branch_id", branchId);


        const queryString = params.toString();
        if (queryString) {
            url += `?${queryString}`;
        }

        return await request(url, "GET", null, headers());
    }
);

export const fetchTermsList = createAsyncThunk(
    "educationQuality/fetchTermsList",
    async (academicYear = "2025-2026") => {
        const { request } = useHttp();
        return await request(`${API_URL}terms/list-term/${academicYear}/`, "GET", null, headers());
    }
);

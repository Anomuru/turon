import { createAsyncThunk } from '@reduxjs/toolkit';
import { API_URL, headers } from 'shared/api/base';

export const fetchTeacherPDList = createAsyncThunk(
    'teacherPD/fetchList',
    async (params = {}, { rejectWithValue }) => {
        try {
            const query = new URLSearchParams(
                Object.fromEntries(
                    Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '')
                )
            ).toString();
            const url = `${API_URL}Teachers/teacher-pd/${query ? '?' + query : ''}`;
            const res = await fetch(url, { method: 'GET', headers: headers() });
            if (!res.ok) throw new Error(res.status);
            return await res.json();
        } catch (e) {
            return rejectWithValue(e.message);
        }
    }
);

export const fetchTeacherPDById = createAsyncThunk(
    'teacherPD/fetchById',
    async (id, { rejectWithValue }) => {
        try {
            const res = await fetch(`${API_URL}Teachers/teacher-pd/${id}/`, {
                method: 'GET',
                headers: headers(),
            });
            if (!res.ok) throw new Error(res.status);
            return await res.json();
        } catch (e) {
            return rejectWithValue(e.message);
        }
    }
);

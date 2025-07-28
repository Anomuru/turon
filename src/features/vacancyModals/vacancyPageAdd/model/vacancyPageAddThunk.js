import {createAsyncThunk} from "@reduxjs/toolkit";
import {API_URL, useHttp, headers} from "shared/api/base";


export const vacancyPageAddThunk = createAsyncThunk(
    'vacancySlice/vacancyPageAddThunk',
    async (newVacancy, {rejectWithValue}) => {
        try {
            const response = await fetch(`${API_URL}Permissions/jobs/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newVacancy),
            });

            if (!response.ok) {
                throw new Error('Failed to add vacancy');
            }

            const data = await response.json();
            return data;
        } catch (error){
            return rejectWithValue(error.message);
        }
    }
)




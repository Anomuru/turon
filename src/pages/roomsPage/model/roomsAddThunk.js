import { createAsyncThunk } from '@reduxjs/toolkit';
import {API_URL} from "../../../shared/api/base";

export const roomsAddThunk = createAsyncThunk(
    'rooms/addRoom',
    async (newRoom, { rejectWithValue }) => {
        try {
            const response = await fetch(`${API_URL}Rooms/rooms_create/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newRoom),
            });

            if (!response.ok) {
                throw new Error('Failed to add room');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);


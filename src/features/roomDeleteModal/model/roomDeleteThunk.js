import { createAsyncThunk } from '@reduxjs/toolkit';
import { API_URL, useHttp, headers } from 'shared/api/base';

export const deleteRoomThunk = createAsyncThunk(
    'roomsSlice/deleteRoom',
    async (id) => {
        const { request } = useHttp();
        await request(`${API_URL}Rooms/rooms_delete/${id}/`, 'DELETE', null, headers());
        return id;
    }
);


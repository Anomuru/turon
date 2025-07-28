import { createAsyncThunk } from '@reduxjs/toolkit';
import {API_URL, headers, useHttp} from 'shared/api/base';


export const editRoomThunk = createAsyncThunk(
    'roomsEditModal/editRoom',
    async ({ id, updatedRoom }) => {
        const { request } = useHttp();
        return await request(`${API_URL}Rooms/rooms_update/${id}/`, 'PATCH', JSON.stringify(updatedRoom) , headers());
    }
);



import { createAsyncThunk } from '@reduxjs/toolkit';
import {API_URL, headersImg, useHttp,} from 'shared/api/base';

export const uploadRoomImageThunk = createAsyncThunk(
    'rooms/uploadRoomImage',
    async ({ roomId, imageFile }) => {
            const { request } = useHttp();
            const formData = new FormData();
            formData.append('image', imageFile);
            formData.append('room', roomId);

            const response = await request(`${API_URL}Rooms/rooms_image_create/`, 'POST', formData, headersImg());
            return { roomId, imageUrl: response.imageUrl };
    }
);

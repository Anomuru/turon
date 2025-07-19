import { createAsyncThunk } from '@reduxjs/toolkit';
import {API_URL, useHttp, headers, headersImg} from '../../../shared/api/base';

export const fetchRoomImages = createAsyncThunk(
    'roomImageSlice/fetchRoomImages',
    async (id) => {
        const { request } = useHttp();
        const response = await request(`${API_URL}Rooms/rooms_image/${id}/`, 'GET', null, headers());
        return response.roomimages;
    }
);

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

import { createAsyncThunk } from '@reduxjs/toolkit';
import {API_URL, branchQuery, headers, useHttp} from '../../../shared/api/base';

export const fetchRoomsData = createAsyncThunk(
    'roomsSlice/fetchRoomsData',
    async ({id}) => {
        const { request } = useHttp();
        return await request(`${API_URL}Rooms/rooms/?branch=${id}&deleted=False`, 'GET', null, headers())
    }
);

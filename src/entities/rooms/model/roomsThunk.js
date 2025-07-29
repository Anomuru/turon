import { createAsyncThunk } from '@reduxjs/toolkit';
import {API_URL, headers, useHttp} from 'shared/api/base';

export const fetchRoomsData = createAsyncThunk(
    'roomsSlice/fetchRoomsData',
    async ({id, selectedSeat, boardCond}) => {
        const { request } = useHttp();
        return await request(
            `${API_URL}Rooms/rooms/?deleted=False&branch=${id}${boardCond ? `&electronic_board=${boardCond}` : ""}${selectedSeat ? `&seats_number=${selectedSeat}` : ""}`,
            "GET", null, headers()
        )
    }
);

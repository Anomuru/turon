import {createAsyncThunk} from '@reduxjs/toolkit';
import {API_URL, headers, ParamUrl, useHttp} from 'shared/api/base';

export const fetchRoomsData = createAsyncThunk(
    'roomsSlice/fetchRoomsData',
    async ({branch, seats_number, electronic_board, limit, offset}) => {
        const {request} = useHttp();
        return await request(
            `${API_URL}Rooms/rooms/?${ParamUrl({deleted: "False", limit, offset, branch, electronic_board, seats_number})}`,
            "GET", null, headers()
        )
    }
);

// Rooms/rooms/?limit=${limit}&offset=${offset}&deleted=False&branch=${id}${boardCond ? `&electronic_board=${boardCond}` : ""}${selectedSeat ? `&seats_number=${selectedSeat}` : ""}

import {createAsyncThunk} from "@reduxjs/toolkit";
import {API_URL, useHttp, headers} from "shared/api/base";

export const  fetchInsideRoom = createAsyncThunk(
    'roomsSlice/fetchInsideRoom',
    async (id) => {
        const {request} = useHttp();
        return await request(`${API_URL}Rooms/rooms/${id}`,"GET",null,headers())
    }
)

export const editRoomThunk = createAsyncThunk(
    'roomsEditModal/editRoom',
    async ({ id, updatedRoom }) => {
        const { request } = useHttp();
        return await request(`${API_URL}Rooms/rooms_update/${id}/`, 'PATCH', JSON.stringify(updatedRoom));
    }
);
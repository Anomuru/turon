import { createSlice } from '@reduxjs/toolkit';
import {uploadRoomImageThunk} from "./roomImageAddThunk";

const initialState = {
    rooms: [],
    status: 'idle',
    error: null,
};

const roomsImageAddSlice = createSlice({
    name: 'rooms',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(uploadRoomImageThunk.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(uploadRoomImageThunk.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const { roomId, imageUrl } = action.payload;
                const existingRoom = state.rooms.find(room => room.id === roomId);
                if (existingRoom) {
                    existingRoom.images = [...existingRoom.images, imageUrl];
                }
            })
            .addCase(uploadRoomImageThunk.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export default roomsImageAddSlice.reducer;

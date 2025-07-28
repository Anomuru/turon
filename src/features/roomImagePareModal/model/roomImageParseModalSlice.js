import { createSlice } from '@reduxjs/toolkit';
import { fetchRoomImages, uploadRoomImageThunk } from './roomImageParseModalThunk';

const initialState = {
    roomImageData: [],
    roomsStatus: 'idle',
    error: null,
};

export const roomImageSlice = createSlice({
    name: 'roomImageSlice',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchRoomImages.pending, (state) => {
                state.roomsStatus = 'loading';
            })
            .addCase(fetchRoomImages.fulfilled, (state, action) => {
                state.roomsStatus = 'success';
                state.roomImageData = action.payload;
            })
            .addCase(fetchRoomImages.rejected, (state) => {
                state.roomsStatus = 'error';
                state.error = 'Failed to fetch room images';
            })
            .addCase(uploadRoomImageThunk.fulfilled, (state, action) => {
                state.roomImageData.push(action.payload);
            });
    }
});

export default roomImageSlice.reducer;

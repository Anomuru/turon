import {createSlice} from "@reduxjs/toolkit";
import {editRoomThunk} from "./roomEditThunk";

const roomsEditModalSlice = createSlice({
    name: 'roomsEditModal',
    initialState: {
        room: {},
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(editRoomThunk.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(editRoomThunk.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.room = action.payload;
            })
            .addCase(editRoomThunk.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export default roomsEditModalSlice.reducer;
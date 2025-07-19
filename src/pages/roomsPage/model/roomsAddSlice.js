import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { roomsAddThunk } from "./roomsAddThunk";

const initialState = {
    rooms: [],
    loading: false,
    error: null,
};

const roomsAddSlice = createSlice({
    name: 'rooms',
    initialState,
    reducers: {
        addRoom: (state, action) => {
            state.rooms.push(action.payload);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(roomsAddThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(roomsAddThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.rooms.push(action.payload);
            })
            .addCase(roomsAddThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { addRoom } = roomsAddSlice.actions;

export default roomsAddSlice.reducer;

import {createSlice} from "@reduxjs/toolkit";
import {deleteRoomThunk} from "./roomDeleteThunk";

const roomDeleteSlice = createSlice({
    name: 'rooms',
    initialState: {
        rooms: [],
        room: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(deleteRoomThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteRoomThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.rooms = state.rooms.filter(room => room.id !== action.payload); // Roomni o'chirish
            })
            .addCase(deleteRoomThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export default roomDeleteSlice.reducer
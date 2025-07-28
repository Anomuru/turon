import { createSlice } from "@reduxjs/toolkit";
import { fetchInsideRoom, editRoomThunk } from "./roomThunk";

const initialState = {
    insideRoom: [],
    loading: false,
    error: null
};

export const roomssSlice = createSlice({
    name: "roomssSlice",
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchInsideRoom.pending, state => { state.fetchRoomsStatus = 'loading'; })
            .addCase(fetchInsideRoom.fulfilled, (state, action) => {
                state.fetchRoomsStatus = 'success';
                state.insideRoom = action.payload;
            })
            .addCase(fetchInsideRoom.rejected, state => { state.fetchRoomsStatus = 'error'; })
            .addCase(editRoomThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(editRoomThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.insideRoom = {
                    ...state.insideRoom,
                    ...action.payload
                };
            })
            .addCase(editRoomThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
});

export default roomssSlice.reducer;


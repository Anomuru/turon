import {createSlice} from "@reduxjs/toolkit";

import {fetchRoomsData} from "./roomsThunk";

const initialState = {
    roomsData: [],
    roomsStatus: "idle",
    error: null,
    loading: false
}

export const roomsSlice = createSlice(
    {
        name: "roomsSlice",
        initialState,
        reducers: {
            onAddRooms: (state , action) => {
                console.log(action.payload)
                state.roomsData = [...state.roomsData, action.payload]

            }

        },
        extraReducers: builder =>
            builder
                .addCase(fetchRoomsData.pending, state => {
                    state.loading = true;
                    state.error = null;
                })
                .addCase(fetchRoomsData.fulfilled,( state, action )=> {
                    state.loading = false;
                    state.roomsData = action.payload
                    console.log(action.payload)
                    state.roomsStatus = 'success'
                })
                .addCase(fetchRoomsData.rejected, state => {
                    state.error = "error"
                })
    }
)

export const {onAddRooms} = roomsSlice.actions

export default roomsSlice.reducer
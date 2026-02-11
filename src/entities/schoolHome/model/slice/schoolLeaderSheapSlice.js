import {createSlice} from "@reduxjs/toolkit";

import imgProfile from "shared/assets/icons/leaderSheap.svg"

import {getLeaderShip} from "../thunk/leaderShipThunk";

const initialState = {
    data: [
        {id: 1, name: "dsadas" , job: "fdsfds" , descr: "fdsfds" , img: imgProfile},
        {id: 1, name: "dsadas" , job: "fdsfds" , descr: "fdsfds" , img: imgProfile},
        {id: 1, name: "dsadas" , job: "fdsfds" , descr: "fdsfds" , img: imgProfile},
        {id: 1, name: "dsadas" , job: "fdsfds" , descr: "fdsfds" , img: imgProfile},
        {id: 1, name: "dsadas" , job: "fdsfds" , descr: "fdsfds" , img: imgProfile},
        {id: 1, name: "dsadas" , job: "fdsfds" , descr: "fdsfds" , img: imgProfile},
    ]
}


const schoolLeaderSheapSlice = createSlice({
    name: "schoolLeaderSheapSlice",
    reducers: {
        onAdd: (state, action) => {
            state.data = [...state.data, action.payload]
        },
        onDelete: (state, action) => {
            state.data = [...state.data.filter(item => item.id !== action.payload)]
        },
        onEdit: (state, action) => {
            state.data = [...state.data.filter(item => item.id !== action.payload.id), action.payload.data]
        }


    },
    initialState,
    extraReducers: builder =>
        builder
            .addCase(getLeaderShip.pending, state => {
                state.loading = true
                state.error = false

            })
            .addCase(getLeaderShip.fulfilled, (state, action) => {
                state.loading = false
                state.data = action.payload
                state.error = false
            })
            .addCase(getLeaderShip.rejected, state => {
                state.loading = false
                state.error = true
            })
})

export const {onAdd, onDelete, onEdit} = schoolLeaderSheapSlice.actions
export default schoolLeaderSheapSlice.reducer
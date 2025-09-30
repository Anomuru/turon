import {createSlice} from "@reduxjs/toolkit";
import {roomsSlice} from "entities/rooms/model/roomsSlice.js";

const data = [
    {
        id: 1,
        name: "Gulnora Aliyeva",
        subject: "Matematika",
        date: "2025-10-01",
        eqiupments: [
            {
                id: 1,
                name: "Kompyuter",
                quantity: 2
            },
            {
                id: 2,
                name: "Proektor",
                quantity: 1
            },
            {
                id: 3,
                name: "Printer",
                quantity: 3
            }
        ]
    },
    {
        id: 2,
        name: "Ahmadjon Ismoilov",
        subject: "Fizika",
        date: "2025-09-15",
        eqiupments: [
            {
                id: 1,
                name: "Kompyuter",
                quantity: 1
            },
            {
                id: 2,
                name: "Proektor",
                quantity: 1
            },
            {
                id: 4,
                name: "Laboratoriya to'plami",
                quantity: 5
            }
        ]
    },
    {
        id: 3,
        name: "Dilshod Karimov",
        subject: "Kimyo",
        date: "2025-11-20",
        eqiupments: [
            {
                id: 1,
                name: "Kompyuter",
                quantity: 3
            },
            {
                id: 2,
                name: "Proektor",
                quantity: 2
            }
        ]
    }
]


const initialState = {
    quarterMasters: data,
    loading: false,
    error: null
}

export const quarterMasterSlice = createSlice({
    name: "quarterMasterSlice",
    initialState,
    reducers: {},

})

export const {reducer: quarterMasterReducer} = quarterMasterSlice

export default quarterMasterSlice.reducer
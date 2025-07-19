import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    data: [
        {
            type: "Kitob",
            payment: 100000,
            date: "2024-05-15"
        },
        {
            type: "Kitob",
            payment: 100000,
            date: "2024-05-15"
        },
        {
            type: "Kitob",
            payment: 100000,
            date: "2024-05-15"
        },
        {
            type: "Kitob",
            payment: 100000,
            date: "2024-05-15"
        }
    ],
    loading: false,
    error: null
}

export const BooksSlice = createSlice({
    name: "BooksSlice",
    initialState,
    reducers: {},
})

export default BooksSlice.reducer
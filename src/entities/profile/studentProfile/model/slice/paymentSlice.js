import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    data: [
        {
            type: "To’lov",
            payment: 100000,
            date: "2024-05-15",
            paymentType: "click",
        },
        {
            type: "To’lov",
            payment: 100000,
            date: "2024-05-15",
            paymentType: "click",
        },
        {
            type: "Chegirma",
            payment: 100000,
            date: "2024-05-15"
        },
        {
            type: "Chegirma",
            payment: 100000,
            date: "2024-05-15"
        }
    ],
    loading: false,
    error: null
}

export const PaymentSlice = createSlice({
    name: "PaymentSlice",
    initialState,
    reducers: {},
})

export default PaymentSlice.reducer
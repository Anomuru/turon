import {createSlice} from "@reduxjs/toolkit";


const initialState = {
    pageType: [
        {label: "studentPayments" , name: "O'quvchilar tolovlari"},
        {label: "teacherSalary" , name: "O'qituvchilar oyligi"},
        {label: "employeesSalary" , name: "Ishchilar oyligi"},
        {label: "overhead" , name: "Qo'shimcha xarajatlar"},
        {label: "capital" , name: "Kapital xarajatlari"},
    ],
    totalCount: [
        { name: "Total Amount" ,  totalPayment: 321321213, totalPaymentCount: 12 , type: "amount"},
        { name: "Cash Payments" ,  totalPayment: 321321213, totalPaymentCount: 12 , type: "cash"},
        { name: "Click Payments" ,  totalPayment: 321321213, totalPaymentCount: 12 , type: "click"},
        { name: "Bank Transfers" ,  totalPayment: 321321213, totalPaymentCount: 12 , type: "bank"},


    ],




}


const accountingNewSlice = createSlice({
    name: "accountingNewSlice",
    initialState,
    reducers: {}
})

export const {reducer: accountingNewReducer} = accountingNewSlice
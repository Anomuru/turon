import {studentSlice} from "../../index";

export const getAccountingSelect = (state) =>
    state.accountingSlice?.pages


export const getAccountingActivePage = (state) =>
    state.accountingSlice?.activePage

export const getAccountingOtchot = (state) =>
    state.accountingSlice?.accountingPages

export const getStudentsData =(state) =>
    state.studentSlice?.studentsData


export const getEncashment = (state) =>
    state.accountingSlice.encashment
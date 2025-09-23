import {createAsyncThunk} from "@reduxjs/toolkit";
import {API_URL, headers, useHttp} from "shared/api/base.js";


const renderFilter = ({ selectedPayment, from, to, range }) => {
    let query = "";

    if (selectedPayment?.length > 0) {
        query += `&payment_type=${selectedPayment.join(",")}`;
    }


    if (from && to) {
        query += `&date_after=${from}&date_before=${to}`;
    }

    if (range[0] !== 0 || range[1] !== 10000000) {
        query += `&payment_sum_min=${range[0]}&payment_sum_max=${range[1]}`;
    }

    return query;
};

const renderRoute = (selectType) => {
    console.log(selectType , "selectType")
    switch (selectType) {
        case "studentPayments":
            return `Students/student_payment_list/`;
        case "teacherSalary":
            return `Teachers/teacher-salary-list/`;
        case "employeesSalary":
            return `Users/salaries/`;
        case "overhead":
            return `Overhead/overhead_list/`;
        case "capital":
            return `Capital/old_capital_list/`;
        default:
            return `Students/student_payment_list/`;
    }
}

export const fetchAccountingData = createAsyncThunk(
    "accountingNewSlice/fetchAccountingData",
    async ({branchId, pageSize, currentPage, selectedPayment, from, to, range , selectType}) => {
        const {request} = useHttp();
        return await request(
            `${API_URL}${renderRoute(selectType)}?branch=${branchId}&limit=${pageSize}&offset=${(currentPage - 1) * pageSize}${renderFilter({selectedPayment, from, to, range})}`,
            "GET",
            null,
            headers()
        );
    }
);
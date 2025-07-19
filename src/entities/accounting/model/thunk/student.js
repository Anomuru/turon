import {createAsyncThunk} from "@reduxjs/toolkit";
import {API_URL, headers, useHttp} from "../../../../shared/api/base";


export const getStudentPayment = createAsyncThunk(
    "studentSlice/getStudentPayment",
    async (branchID) => {
        const {request} = useHttp()
        return await request(`${API_URL}Students/student_payment_list/?branch=${branchID.id}` , 'GET' , null , headers())
    }
)


export const getDeletedPayment = createAsyncThunk(
    "studentSlice/getDeletedPayment",
    async (branchId) => {
        const {request} = useHttp()
        return await request(`${API_URL}Students/student_payment_deleted_list/?branch=${branchId.id}` , 'GET' , null , headers())
    }
)
import {createAsyncThunk} from "@reduxjs/toolkit";
import {API_URL, headers, ParamUrl, useHttp} from "../../../../shared/api/base";


export const getStudentPayment = createAsyncThunk(
    "studentSlice/getStudentPayment",
    async ({branch, limit, offset , search}) => {
        const {request} = useHttp()
        return await request(`${API_URL}Students/student_payment_list/?${ParamUrl({branch, limit, offset , search})}` , 'GET' , null , headers())
    }
)


export const getDeletedPayment = createAsyncThunk(
    "studentSlice/getDeletedPayment",
    async ({branch, limit, offset , search}) => {
        const {request} = useHttp()
        return await request(`${API_URL}Students/student_payment_deleted_list/?${ParamUrl({branch, limit, offset , search})}` , 'GET' , null , headers())
    }
)
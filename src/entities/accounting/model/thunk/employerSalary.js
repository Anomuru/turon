import {createAsyncThunk} from "@reduxjs/toolkit";
import {API_URL, headers, ParamUrl, useHttp} from "../../../../shared/api/base";

export const getEmpSalary  = createAsyncThunk(
    "employerSlice/getEmpSalary",
    async ({branch, limit, offset}) => {
        const {request} = useHttp()
        return await request(`${API_URL}Users/salaries/?${ParamUrl({branch, limit, offset})}` , "GET" , null , headers())
    }
)

export const getDeletedEmpSalary  = createAsyncThunk(
    "employerSlice/getDeletedEmpSalary",
    async ({branch, limit, offset}) => {
        const {request} = useHttp()
        return await request(`${API_URL}Users/salaries-deleted/?${ParamUrl({branch, limit, offset})}` , "GET" , null , headers())
    }
)

// export const changeEmployerPayment = createAsyncThunk(
//     "employerSlice/changeEmployerPayment",
//     async ({id , obj}) => {
//         const {request} = useHttp()
//         return await
//     }
// )
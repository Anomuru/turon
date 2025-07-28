import {createAsyncThunk} from "@reduxjs/toolkit";
import {API_URL, headers, useHttp} from "../../../../shared/api/base";

export const getEmpSalary  = createAsyncThunk(
    "employerSlice/getEmpSalary",
    async (branchID) => {
        const {request} = useHttp()
        return await request(`${API_URL}Users/salaries/?branch=${branchID.id}` , "GET" , null , headers())
    }
)

export const getDeletedEmpSalary  = createAsyncThunk(
    "employerSlice/getDeletedEmpSalary",
    async (branchID) => {
        const {request} = useHttp()
        return await request(`${API_URL}Users/salaries-deleted/?branch=${branchID.id}` , "GET" , null , headers())
    }
)

// export const changeEmployerPayment = createAsyncThunk(
//     "employerSlice/changeEmployerPayment",
//     async ({id , obj}) => {
//         const {request} = useHttp()
//         return await
//     }
// )
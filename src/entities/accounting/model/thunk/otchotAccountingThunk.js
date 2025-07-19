import {createAsyncThunk} from "@reduxjs/toolkit";
import {API_URL, headers, useHttp} from "../../../../shared/api/base";

export const getStudentPayment = createAsyncThunk(
    "otchotSlice/getStudentPayment",
    (branchID) => {
        const {request} = useHttp()

        return request(`${API_URL}Encashment/student_payments/?branch=${branchID}` , "GET" , null , headers())
    }
)


export const getTeacherSalary = createAsyncThunk(
    "otchotSlice/getTeacherSalary",
    (branchID) => {
        const {request} = useHttp()
        return request(`${API_URL}Encashment/teacher_salary/?branch=${branchID}` , "GET" , null , headers())

    }
)

export const getEmployer = createAsyncThunk(
    "otchotSlice/getEmployer",
    (branchId) => {
        const {request} = useHttp()
        return  request(`${API_URL}Encashment/employer_salary/?branch=${branchId}`)
    }
)



export const getAll = createAsyncThunk(
    "otchotSlice/getAll",
    ({branchId}) => {
        const {request} = useHttp()

        return request(`${API_URL}Encashment/encashment_school/`, "POST", JSON.stringify({branch : branchId}), headers())

    }
)
import {createAsyncThunk} from "@reduxjs/toolkit";
import {API_URL, headers, useHttp} from "../../../../shared/api/base";
import {useDispatch} from "react-redux";
import {onAddAlertOptions} from "../../../../features/alert/model/slice/alertSlice";
import {branch} from "../../../../features/workerSelect";


export const createClassType = createAsyncThunk(
    "classSlice/createClassType",
    async (data) => {
        const {request} = useHttp()
        return await request(`${API_URL}Class/class_types/`, "POST", JSON.stringify(data), headers())
    }
)


export const getClassTypes = createAsyncThunk(
    "classSlice/getClassTypes",
    async (userBranchId) => {
        const {request} = useHttp()
        return await request(`${API_URL}Class/class_types/?branch=${userBranchId}`, "GET", null, headers())
    }
)

export const updateClassType = createAsyncThunk(
    "classSlice/updateClassType",
    async ({id, data}) => {
        const {request} = useHttp()

        return await request(`${API_URL}Class/class_types/${id}/`, "PATCH", JSON.stringify(data), headers())
    }
)


export const getClassTypeNumber = createAsyncThunk(
    "classSlice/getClassTypeNumber",
    async (branchId) => {
        const {request} = useHttp()
        return await request(`${API_URL}Class/class_number_list/`, "GET", null, headers())
    }
)


export const classItem = createAsyncThunk(
    "classSlice/classItem",
    async ({id , branchId}) => {
        const {request} = useHttp()
        return await request(`${API_URL}Class/class_number/${id}/?branch=${branchId}`, "GET", null, headers())
    }
)


export const updateClassItem = createAsyncThunk(
    "classSlice/updateClassItem",
    async ({idClass, res}) => {
        const {request} = useHttp()
        return await request(`${API_URL}Class/class_number_update/${idClass}/`, "PUT", JSON.stringify(res), headers())
    }
)


export const createColor = createAsyncThunk(
    "classSlice/createColor",
    async (res) => {
        const {request} = useHttp()
        return await request(`${API_URL}Class/class_colors/`, "POST", JSON.stringify(res), headers())
    }
)
export const getColor = createAsyncThunk(
    "classSlice/getColor",
    async () => {
        const {request} = useHttp()
        return await request(`${API_URL}Class/class_colors/`, "GET", null, headers())
    }
)


export const updateColor = createAsyncThunk(
    "classSlice/updateColor",
    async ({id, res}) => {
        const {request} = useHttp()
        return await request(`${API_URL}Class/class_colors/${id}/`, "PATCH", JSON.stringify(res), headers())

    }
)



export const fetchClassSubjects = createAsyncThunk(
    "classSlice/fetchClassSubjects",
    async () => {
        const {request} = useHttp()
        return await request(`${API_URL}Subjects/subject/`, "GET", null, headers())
    }
)



export const getClassNewNumberList = createAsyncThunk(
    "classSlice/getClassNewNumberList",
    async ({branchId,id}) => {
        const {request} = useHttp()
        return await request(`${API_URL}Class/class_number_subject_list?branch=${branchId}&id=${id}`, "GET", null, headers())
    }
)
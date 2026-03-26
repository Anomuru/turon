import {createAsyncThunk} from "@reduxjs/toolkit";
import {API_URL, headers, headersImg, useHttp} from "shared/api/base.js";





export const createCapitalCategory = createAsyncThunk(
    'capitalSlice/createCapitalCategory',
    async ({data, changedImages}) => {
        const {request} = useHttp()
        const formData = new FormData
        formData.append("img", changedImages)
        formData.append("name", data.name)
        formData.append("id_number", data.id_number)
        return await request(`${API_URL}Capital/capital_category/`, "POST", formData, headersImg())

    }
)

export const getCapitalDataThunk = createAsyncThunk(
    'capitalSlice/getCapitalDataThunk',
    async (search) => {
        const {request} = useHttp()
        return await request(`${API_URL}Capital/capital_category/?search=${search}`, "GET", null, headers())
    }
)
export const getCapitalInfo = createAsyncThunk(
    "capitalSlice/getCapitalInfo",
    async (id) => {
        const {request} = useHttp()
        return await request(`${API_URL}Capital/capital_category/${id}/`, "GET", null, headers())
    }
)


export const changeCapitalInfoThunk = createAsyncThunk(
    "capitalSlice/changeCapitalInfoThunk",
    async ({id, data}) => {
        const {request} = useHttp()
        return await request(`${API_URL}Capital/capital_category/${id}/`, "PATCH", JSON.stringify(data), headers())
    }
)


export const getInsideCategory = createAsyncThunk(
    "capitalSlice/getInsideCategory",
    async ({id, branch}) => {
        const {request} = useHttp()
        return await request(`${API_URL}Capital/capital_list/?category=${id}&branch_id=${branch}`, "GET", null, headers())
    }
)


export const createInsideCategory = createAsyncThunk(
    "changeCapitalInfo/createInsideCategory",
    async ({data, changedImages, selectPayment, userBranchId, id}) => {
        const {request} = useHttp();

        const formData = new FormData()
        formData.append("name" , data.name)
        formData.append("img" , changedImages)
        formData.append("category" , id)
        formData.append("branch" , userBranchId)
        formData.append("id_number" , data.id_number)
        formData.append("price" , data.price)
        formData.append("total_down_cost" , data.total_down_cost)
        formData.append('term' , data.term)
        formData.append("curriculum_hours" , data.curriculum_hours)
        formData.append("payment_type" , selectPayment)
        return await request(`${API_URL}Capital/capital_create/`, "POST", formData, headersImg());
    }
);

export const getPaymentType = createAsyncThunk(
    "changeCapitalInfo/Payments/payment-types/",
    async () => {
        const {request} = useHttp()
        return await request(`${API_URL}Payments/payment-types/`, "GET", null, headers())
    }
)


export const getCapitalCategory = createAsyncThunk(
    "changeCapitalInfo/getCapitalCategory",
    async (id) => {
        const {request} = useHttp()
        return await request(`${API_URL}Capital/capital_one/${id}/`, "GET", null, headers())
    }
)

export const deleteCapitalItem = createAsyncThunk(
    "changeCapitalInfo/deleteCapitalItem",
    async (id) => {
        const {request} = useHttp()
        await request(`${API_URL}Capital/capital_delete/${id}/`, "DELETE", null, headers())
        return id
    }
)

export const updateCapitalItem = createAsyncThunk(
    "changeCapitalInfo/updateCapitalItem",
    async ({id, data}) => {
        const {request} = useHttp()
        const formData = new FormData()
        formData.append("name", data.name)
        formData.append("id_number", data.id_number)
        formData.append("price", data.price)
        formData.append("total_down_cost", data.total_down_cost)
        formData.append("term", data.term)
        formData.append("curriculum_hours", data.curriculum_hours)
        if (data.img) formData.append("img", data.img)
        return await request(`${API_URL}Capital/capital_update/${id}/`, "PATCH", formData, headersImg())
    }
)
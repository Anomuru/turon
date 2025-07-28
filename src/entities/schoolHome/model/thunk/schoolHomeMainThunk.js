import {createAsyncThunk} from "@reduxjs/toolkit";
import {API_URL, header, headerImg, useHttp} from "shared/api/base";

export const fetchHomeMainData = createAsyncThunk(
    "schoolHomeMainSlice/getHomeMainData",
    ({id}) => {
        console.log(id, "id")
        const {request} = useHttp()
        return request(`${API_URL}Ui/fronted-pages/${id}/`, "GET", null, header())
    }
)

export const fetchAddPrograms = createAsyncThunk(
    "schoolHomeMainSlice/fetchAddPrograms",
    ({data, id}) => {
        const {request} = useHttp()
        return request(`${API_URL}Ui/fronted-pages/`, "POST", data, headerImg())
    }
)

export const editProgram = createAsyncThunk(
    "schoolHomeMainSlice/editProgram",
    ({data, id}) => {
        const {request} = useHttp()
        return request(`${API_URL}Ui/fronted-pages/${id}/`, "PATCH", data, headerImg())
    }
)

export const fetchHomeMainDescription = createAsyncThunk(
    "schoolHomeMainSlice/fetchHomeMainDescription",
    ({id}) => {
        const {request} = useHttp()
        return request(`${API_URL}Ui/fronted-pages/${id}/`, "GET", null, header())
    }
)

export const editDescription = createAsyncThunk(
    "schoolHomeMainSlice/editDescription",
    ({data, id}) => {
        const {request} = useHttp()
        return request(`${API_URL}Ui/fronted-pages/${id}/`, "PATCH", JSON.stringify(data), header())
    }
)

export const addDescription = createAsyncThunk(
    "schoolHomeMainSlice/editDescription",
    (data) => {
        const {request} = useHttp()
        return request(`${API_URL}Ui/fronted-pages/`, "POST", JSON.stringify(data), header())
    }
)

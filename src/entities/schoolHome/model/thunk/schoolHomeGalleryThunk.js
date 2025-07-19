import {createAsyncThunk} from "@reduxjs/toolkit";
import {API_URL, header, headerImg, useHttp} from "shared/api/base";

export const fetchHomeGalleryData = createAsyncThunk(
    "schoolHomeGallerySlice/fetchHomeGalleryData",
    ({id}) => {
        console.log(id, "id")
        const {request} = useHttp()
        return request(`${API_URL}Ui/fronted-pages/${id}/`, "GET", null, header())
    }
)

export const fetchAddGallery = createAsyncThunk(
    "schoolHomeGallerySlice/fetchAddGallery",
    ({data, id}) => {
        const {request} = useHttp()
        return request(`${API_URL}Ui/fronted-pages/`, "POST", data, headerImg())
    }
)

export const editGallery = createAsyncThunk(
    "schoolHomeGallerySlice/editGallery",
    ({data, id}) => {
        const {request} = useHttp()
        return request(`${API_URL}Ui/fronted-pages/${id}/`, "PATCH", data, headerImg())
    }
)

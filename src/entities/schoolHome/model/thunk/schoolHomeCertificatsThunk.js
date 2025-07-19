import {createAsyncThunk} from "@reduxjs/toolkit";
import {API_URL, header, headerImg, useHttp} from "../../../../shared/api/base";

export const fetchCertificatData = createAsyncThunk(
    "schoolHomeCertificatSlice/fetchCertificatData",
    ({id}) => {
        const {request} = useHttp()
        return request(`${API_URL}Ui/fronted-pages/${id}/`, "GET", null, header())
    }
)

export const fetchAddCertificat = createAsyncThunk(
    "schoolHomeCertificatSlice/fetchAddCertificat",
    ({data, id}) => {
        const {request} = useHttp()
        return request(`${API_URL}Ui/fronted-pages/`, "POST", data, headerImg())
    }
)


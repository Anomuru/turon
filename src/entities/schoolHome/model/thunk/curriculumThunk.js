import {createAsyncThunk} from "@reduxjs/toolkit";
import {API_URL, header, useHttp} from "../../../../shared/api/base";


export const getCurriculum = createAsyncThunk(

    "schoolCurricularSlice/getCurriculum",
    async (id) => {
        const {request} = useHttp()

        return await request(`${API_URL}Ui/fronted-pages/${7}/` , "GET" , null , header())
    }
)

export const getExtraCurriculum = createAsyncThunk(

    "schoolCurricularSlice/getExtraCurriculum",
    async (id) => {
        const {request} = useHttp()

        return await request(`${API_URL}Ui/fronted-pages/${6}/` , "GET" , null , header())
    }
)
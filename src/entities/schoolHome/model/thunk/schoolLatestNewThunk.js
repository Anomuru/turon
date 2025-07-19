import {createAsyncThunk} from "@reduxjs/toolkit";
import {API_URL, header, useHttp} from "../../../../shared/api/base";


export const getLatestNew = createAsyncThunk(

    "getLatestNew/schoolLatestSlice",
    async (id) => {
        const {request} = useHttp()

        return await request(`${API_URL}Ui/fronted-pages/${id}/` , "GET" , null , header())
    }
)
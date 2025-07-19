import {createAsyncThunk} from "@reduxjs/toolkit";
import {API_URL, header, useHttp} from "../../../../shared/api/base";


export const fetchHomePage = createAsyncThunk(
    "getHomePageSlice/fetchHomePage",
    async () => {
        const {request} = useHttp()
       return  await request(`${API_URL}Ui/fronted-page-types/` , "GET" , null , header())
    }
)
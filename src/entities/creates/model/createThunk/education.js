import {createAsyncThunk} from "@reduxjs/toolkit";
import {API_URL, headers, useHttp} from "../../../../shared/api/base";

export const postEducationThunk = createAsyncThunk(
    'postEducationSlice/postEducationThunk',

    async(data) =>{
        const {request} = useHttp()
        return await request(`${API_URL}Language/language/` , "POST" , JSON.stringify(data) , headers())
    }
)
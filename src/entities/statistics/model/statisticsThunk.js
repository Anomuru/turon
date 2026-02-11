import {createAsyncThunk} from "@reduxjs/toolkit";
import {API_URL, headers, useHttp} from "shared/api/base.js";

export const fetchStatistics = createAsyncThunk(
    "statisticsSlice/fetchStatistics",
    async ({data , activePayment}) => {
        const {request} = useHttp()


        return await request(`${API_URL}Encashment/one_day_report/?payment_type=${activePayment}` , "POST" , JSON.stringify(data) , headers())
    }
)
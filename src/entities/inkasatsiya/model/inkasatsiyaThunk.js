import {createAsyncThunk} from "@reduxjs/toolkit";
import {API_URL, headers, useHttp} from "../../../shared/api/base";


export const inkasatsiyaThunk = createAsyncThunk(
    "inkasatsiyaSlice/inkasatsiyaThunk",
    async ({res , branchId}) => {
        const {request} = useHttp()
        return await request(`${API_URL}Encashment/encashment/?branch=${branchId}/`, "POST", JSON.stringify(res), headers())
    }
)
import {createAsyncThunk} from "@reduxjs/toolkit";
import {API_URL, header, headerImg, useHttp} from "../../../../shared/api/base";

export const getVisionSchool = createAsyncThunk(
    "visionSchoolSlice/getVisionSchool",
    ({id}) => {
        const {request} = useHttp()
        return request(`${API_URL}Ui/fronted-pages/${id}/`, "GET", null, header())
    }
)


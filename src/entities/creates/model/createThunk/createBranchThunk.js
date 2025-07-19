import {createAsyncThunk} from "@reduxjs/toolkit";
import {API_URL, headers, useHttp} from "shared/api/base";

import {useDispatch} from "react-redux";
import {onAddAlertOptions} from "../../../../features/alert/model/slice/alertSlice";


export const createBranchThunk = createAsyncThunk(
    "postCreateBranch/createBranchThunk",
    async(res) => {
        const {request} = useHttp();
        return await request(`${API_URL}Branch/branch_create/` , "POST" , JSON.stringify(res) , headers())
    }
)


export const getSystemId = createAsyncThunk(
    "postCreateBranch/getSystemId",
    async () => {
        const {request }= useHttp()
        return await request(`${API_URL}System/systems/` , "GET" , null  ,headers())

    }
)

export const getLocationThunk = createAsyncThunk(
    "getLocationSlice/getLocationThunk",
    async () =>{
        const {request} = useHttp()
        return await request(`${API_URL}Location/location_list/` , "GET" , null , headers())
    }
)

export const changeLocation = createAsyncThunk(
    "postCreateBranch/changeLocation",
    async ({data ,id}) => {
        const {request} = useHttp()
        return await request(`${API_URL}Location/location_update/${id}/`, "PATCH", JSON.stringify(data), headers())

    }
)
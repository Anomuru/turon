import {createAsyncThunk} from "@reduxjs/toolkit";
import {API_URL, headers, useHttp} from "shared/api/base";

export const fetchFilteredListData = createAsyncThunk(
    "filteredLeadsListSlice/fetchFilteredListData",
    async ({dateFrom , dateTo,branch,currentPage,PageSize}) => {
        const {request} = useHttp()
        return request(`${API_URL}Lead/leads_by_branch/?from=${dateFrom}&to=${dateTo}&branch_id=${branch}&offset=${ (currentPage - 1) * 50}&limit=${PageSize}`,"GET", null, headers())
    }
)
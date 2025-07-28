import {createAsyncThunk} from "@reduxjs/toolkit";
import {API_URL, headers, useHttp} from "shared/api/base";

export const fetchFilteredListData = createAsyncThunk(
    "filteredLeadsListSlice/fetchFilteredListData",
    async ({date,branch,currentPage,PageSize}) => {
        const {request} = useHttp()
        return request(`${API_URL}Lead/leads_by_branch/?date=${date}&branch_id=${branch}&current_page=${currentPage}&page_size=${PageSize}`,"GET", null, headers())
    }
)
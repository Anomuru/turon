import {createAsyncThunk} from "@reduxjs/toolkit";

import {useResultsSearch} from "shared/api/search";

export const fetchSearch = createAsyncThunk(
    "newStudents/fetchSearch",
    async (searchStr) => {
        return await useResultsSearch(searchStr)
    }
)
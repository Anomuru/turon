import {createAsyncThunk} from "@reduxjs/toolkit";
import {API_URL, headers, useHttp} from "shared/api/base";
import {clearSelectedLocations} from "../slice/locationsSlice";

export const fetchLocationsThunk = createAsyncThunk(
    'locationsSlice/fetchLocationsThunk',
    async (selectedSystemIds, {rejectWithValue,dispatch}) => {
        const {request} = useHttp();
        try {


            const response = await request(
                `${API_URL}Permissions/user_locations/${selectedSystemIds}/`,
                "GET",
                null,
                headers()
            );



            dispatch(clearSelectedLocations(selectedSystemIds))
            return {list:response, systemId:selectedSystemIds};
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

import {createAsyncThunk} from "@reduxjs/toolkit";
import {API_URL, headers, useHttp} from "shared/api/base";
import {getSystemInited} from "features/themeSwitcher/modal/selector/themeSwitcherSystems";

export const fetchThemeSwitcherSystemsThunk = createAsyncThunk(
    'themeSwitcherSlice/fetchThemeSwitcherSystemsThunk',
    async (selectedSystemIds, {rejectWithValue, getState}) => {
        const {request} = useHttp();



        try {
            const response = await request(
                `${API_URL}Permissions/user_systems/`,
                "GET",
                null,
                headers()
            );

            return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }

    }
);

import { createSlice } from "@reduxjs/toolkit";
import {userSetPermissionThunk, fetchLocationsForSystemsThunk, fetLocationsForBranchesThunk} from "./userSetPermissionThunk";

const initialState = {
    newPermission: [],
    locations: [],
    branches: [],
    loading: false,
    error: null
};

export const userSetPermissionSlice = createSlice({
    name: "userSetPermissionSlice",
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(userSetPermissionThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(userSetPermissionThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null
                state.newPermission = action.payload;
            })
            .addCase(userSetPermissionThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
          
    }
});

export default userSetPermissionSlice.reducer;

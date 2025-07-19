import {createAsyncThunk} from "@reduxjs/toolkit";
import {useHttp, API_URL, headers} from "shared/api/base";

export const fetchLocationsForSystemsThunk = createAsyncThunk(
    'userSetPermissionSlice/fetchLocationsForSystems',
    async (selectedSystemIds) => {
        const {request} = useHttp();
        return await request(`${API_URL}Location/location_for_system/`, "POST", JSON.stringify({systems: selectedSystemIds}), headers())
    }
);

export const fetLocationsForBranchesThunk = createAsyncThunk(
    'userSetPermissionSlice/fetLocationsForBranchesThunk',
    async (selectedLocationIds,) => {
        const {request} = useHttp();
        return await request(`${API_URL}Branch/branch_for_locations/`, "POST", JSON.stringify({locations: selectedLocationIds}), headers())
    }
)

import {createSlice} from "@reduxjs/toolkit";
import {fetchWorkerWithId} from "./vacancyWorkPageThunk";
import {postSelectedPermission} from "../../vacancyWorkerPermission/model/vacancyWorkerPermissionThunk";

const initialState = {
    workerPermission: [],
    loading: false,
    error: null
};


export const vacancyWorkPageSlice = createSlice({
    name: "vacancyWorkPageSlice",
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchWorkerWithId.pending, (state) => {
                state.loading = true
            })
            .addCase(fetchWorkerWithId.fulfilled, (state, action) => {
                state.loading = false;
                state.workerPermission = action.payload;
            })
            .addCase(fetchWorkerWithId.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(postSelectedPermission.pending, (state) => {
                state.loading = true;
            })
            .addCase(postSelectedPermission.fulfilled, (state, action) => {
                state.loading = false;
                const newPermissions = action.payload.permissions;
                const updatedWorker = state.workerPermission.job.map(job => {
                    if (job.id === action.meta.arg.selectedJobID) {
                        return {
                            ...job,
                            group: {
                                ...job.group,
                                permissions: [...job.group.permissions, ...newPermissions]
                            }
                        };
                    }
                    return job;
                });

                state.workerPermission = {
                    ...state.workerPermission,
                    job: updatedWorker
                };
            })
            .addCase(postSelectedPermission.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
});


export default vacancyWorkPageSlice.reducer
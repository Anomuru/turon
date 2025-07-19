import {createSlice} from "@reduxjs/toolkit";
import {fetchAdminTaskManager, fetchBranch, fetchTaskManager} from "features/taskManager/modal/taskManagerThunk";



const initialState = {
    data: [
        {status: "green" , surname: "das" , name: "dasd" , number: "dasd"},
        {status: "green" , surname: "das" , name: "dasd" , number: "dasd"},
        {status: "green" , surname: "das" , name: "dasd" , number: "dasd"},
        {status: "green" , surname: "das" , name: "dasd" , number: "dasd"}
    ],
    completedCount: 12,
    progressCount: 43,
    percentage: 50,
    branchs: [],
    loading: false,
    error: false,

    adminTasks: []

};

const taskManagerSlice = createSlice({
    name: "taskManagerSlice",
    initialState,
    reducers: {
        onRemoveTask: (state, action) => {
            state.data = state.data.filter(item => item.id !== action.payload)
        },

        onCountProgress: (state, action) => {
            state.progressCount = action.payload
        },
        onCountCompleted: (state, action) => {
            state.completedCount = action.payload
        },
        onCountPercentage: (state, action) => {
            state.percentage = action.payload
        },


    },
    extraReducers: builder =>
        builder
            .addCase(fetchTaskManager.pending , state => {
                state.loading = true
                state.error = false
            })
            .addCase(fetchTaskManager.fulfilled , ( state, action) => {
                state.loading = false
                state.data = action.payload.data
                state.percentage = action.payload.accepted_percentage
                state.completedCount = action.payload.completed
                state.progressCount = action.payload.progressing
                state.error = false
            })
            .addCase(fetchTaskManager.rejected , state => {
                state.loading = false
                state.error = true
            })
            .addCase(fetchBranch.pending , state => {
                state.loading = true
                state.error = false
            })
            .addCase(fetchBranch.fulfilled , ( state, action) => {
                state.loading = false
                state.branchs = action.payload
                state.error = false
            })
            .addCase(fetchBranch.rejected , state => {
                state.loading = false
                state.error = true
            })

            .addCase(fetchAdminTaskManager.pending , state => {
                state.loading = true
                state.error = false
            })
            .addCase(fetchAdminTaskManager.fulfilled , ( state, action) => {
                state.loading = false
                state.adminTasks = action.payload.data
                state.percentage = action.payload.accepted_percentage
                state.completedCount = action.payload.completed
                state.progressCount = action.payload.progressing
                state.error = false
            })
            .addCase(fetchAdminTaskManager.rejected , state => {
                state.loading = false
                state.error = true
            })

});



export const {onRemoveTask , onCountCompleted , onAddRegisterItem ,onCountPercentage , onCountProgress} = taskManagerSlice.actions;
export default taskManagerSlice.reducer
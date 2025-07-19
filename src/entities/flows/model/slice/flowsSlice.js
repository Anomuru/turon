import {createSlice} from "@reduxjs/toolkit";
import {fetchFilterFlow, fetchFlows, flowListThunk} from "./flowsThunk";


const initialState = {
    flows: [],
    flowsStatus: "idle",
    flowList: [
        {
            className : "1blue",
            status: true,
            data: [
                {name: "sardor" , surname: "ikromov" , number: "432423" , status: true},
                {name: "sardor" , surname: "ikromov" , number: "432423" , status: true},
                {name: "sardor" , surname: "ikromov" , number: "432423" , status: true},
                {name: "sardor" , surname: "ikromov" , number: "432423" , status: true},
                {name: "sardor" , surname: "ikromov" , number: "432423" , status: true},
                {name: "sardor" , surname: "ikromov" , number: "432423" , status: true},
                {name: "sardor" , surname: "ikromov" , number: "432423" , status: true},
                {name: "sardor" , surname: "ikromov" , number: "432423" , status: true},
                {name: "sardor" , surname: "ikromov" , number: "432423" , status: true},
            ]
        },
        {
            className : "2blue",
            data: [
                {name: "dewdewde" , surname: "ikromov" , number: "432423" , status: true},
                {name: "sardeedwedor" , surname: "ikromov" , number: "432423" , status: true},
                {name: "dewde" , surname: "ikromov" , number: "432423" , status: true},
                {name: "sardor" , surname: "ikromov" , number: "432423" , status: true},
            ]
        },
        {
            className : "3blue",
            data: [
                {name: "sardor" , surname: "dewdew" , number: "432423" , status: true},
                {name: "dewdewd" , surname: "ikromov" , number: "432423" , status: true},
                {name: "dewdewded" , surname: "ikromov" , number: "432423" , status: true},
                {name: "sardor" , surname: "ikrodewdewdmov" , number: "432423" , status: true},
            ]
        },
        {
            className : "2blue",
            data: [
                {name: "dewdewde" , surname: "ikromov" , number: "432423" , status: true},
                {name: "sardeedwedor" , surname: "ikromov" , number: "432423" , status: true},
                {name: "dewde" , surname: "ikromov" , number: "432423" , status: true},
                {name: "sardor" , surname: "ikromov" , number: "432423" , status: true},
            ]
        },
        {
            className : "3blue",
            data: [
                {name: "sardor" , surname: "dewdew" , number: "432423" , status: true},
                {name: "dewdewd" , surname: "ikromov" , number: "432423" , status: true},
                {name: "dewdewded" , surname: "ikromov" , number: "432423" , status: true},
                {name: "sardor" , surname: "ikrodewdewdmov" , number: "432423" , status: true},
            ]
        },
        {
            className : "2blue",
            data: [
                {name: "dewdewde" , surname: "ikromov" , number: "432423" , status: true},
                {name: "sardeedwedor" , surname: "ikromov" , number: "432423" , status: true},
                {name: "dewde" , surname: "ikromov" , number: "432423" , status: true},
                {name: "sardor" , surname: "ikromov" , number: "432423" , status: true},
            ]
        },
        {
            className : "3blue",
            data: [
                {name: "sardor" , surname: "dewdew" , number: "432423" , status: true},
                {name: "dewdewd" , surname: "ikromov" , number: "432423" , status: true},
                {name: "dewdewded" , surname: "ikromov" , number: "432423" , status: true},
                {name: "sardor" , surname: "ikrodewdewdmov" , number: "432423" , status: true},
            ]
        },
        {
            className : "2blue",
            data: [
                {name: "dewdewde" , surname: "ikromov" , number: "432423" , status: true},
                {name: "sardeedwedor" , surname: "ikromov" , number: "432423" , status: true},
                {name: "dewde" , surname: "ikromov" , number: "432423" , status: true},
                {name: "sardor" , surname: "ikromov" , number: "432423" , status: true},
            ]
        },
        {
            className : "3blue",
            data: [
                {name: "sardor" , surname: "dewdew" , number: "432423" , status: true},
                {name: "dewdewd" , surname: "ikromov" , number: "432423" , status: true},
                {name: "dewdewded" , surname: "ikromov" , number: "432423" , status: true},
                {name: "sardor" , surname: "ikrodewdewdmov" , number: "432423" , status: true},
            ]
        }

    ],
    flowListStatus: "idle",

}


export const flowsSlice = createSlice({
    name: "flowsSlice",
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchFlows.pending, state => {
                state.flowsStatus = "loading"
            })
            .addCase(fetchFlows.fulfilled, (state, action) => {
                state.flows = action.payload
                // state.flows = action.payload.results
                state.flowsStatus = "success"
            })
            .addCase(fetchFlows.rejected, (state, action) => {
                state.flowsStatus = "error"
            })

            .addCase(fetchFilterFlow.pending, state => {
                state.flowsStatus = "loading"
            })
            .addCase(fetchFilterFlow.fulfilled, (state, action) => {
                state.flows = action.payload
                // state.flows = action.payload.results
                state.flowsStatus = "success"
            })
            .addCase(fetchFilterFlow.rejected, (state, action) => {
                state.flowsStatus = "error"
            })

            .addCase(flowListThunk.pending, state => {
                state.flowsStatus = "loading"
            })
            .addCase(flowListThunk.fulfilled , (state , action) => {
                state.flowList = action.payload
                state.flowsStatus = "success"
            })
            .addCase(flowListThunk.rejected , (state , action) => {
                state.flowsStatus = "error"
            })
    }
})
export default flowsSlice.reducer
import {createSlice} from "@reduxjs/toolkit";
import {fetchParentList} from "entities/parents/model/parentThunk.js";
import {employerSalarySlice} from "../../employerSalary/model/employerSalarySlice.js";


const initialState = {
    parents: [
        {id: 1, name: "dasd", surname: "dasds", phone: 12323, location: "chjofrf", date: "dasd",},
        {id: 21, name: "dasd", surname: "dasds", phone: 12323, location: "chjofrf", date: "dasd",},
        {id: 13, name: "dasd", surname: "dasds", phone: 12323, location: "chjofrf", date: "dasd",},
    ],
    error: null,
    loadingParent: false,

}

const parentSlice = createSlice({
    name: "parentSlice",
    initialState,
    reducers: {
        onDeleteParents: (state, action) => {
            state.parents = state.parents.filter(item => item.id !== action.payload)
        },

    },
    extraReducers: builder => builder
        .addCase(fetchParentList.pending, state => {
            state.loadingParent = true
            state.error = false
        })
        .addCase(fetchParentList.fulfilled, (state , action) => {
            state.loadingParent = false
            state.parents = action.payload
            state.error = false
        })
        .addCase(fetchParentList.rejected, state => {
            state.error = true
            state.loadingParent = false
        })
})

export const {onDeleteParents} = parentSlice.actions
export const {reducer: parentReducer} = parentSlice


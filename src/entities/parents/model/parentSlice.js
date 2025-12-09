import {createSlice} from "@reduxjs/toolkit";
import {employerSalarySlice} from "../../employerSalary/model/employerSalarySlice.js";


const initialState = {
    parents: [
        {id:1 , name: "dasd" , surname: "dasds" , phone: 12323 , location: "chjofrf" , date: "dasd" ,},
        {id:21 , name: "dasd" , surname: "dasds" , phone: 12323 , location: "chjofrf" , date: "dasd" ,},
        {id:13 , name: "dasd" , surname: "dasds" , phone: 12323 , location: "chjofrf" , date: "dasd" ,},
    ],
    error: null,
    loadingParent: false,

}

const parentSlice = createSlice({
    name: "parentSlice",
    initialState,
    reducers: {
        onDeleteParents: (state , action ) => {
            state.parents = state.parents.filter(item => item.id !== action.payload)
        },

    },
    extraReducers: builder => {},
})

export const {onDeleteParents} = parentSlice.actions
export const {reducer: parentReducer} = parentSlice


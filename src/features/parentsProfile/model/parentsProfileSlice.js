import {createSlice} from "@reduxjs/toolkit";
import {fetchParentInfo, fetchParentsAvailableStudents} from "features/parentsProfile/model/parentsProfileThunk.js";

const initialState = {
    children: [
        {id: 1, name: "asdas", surname: "dsa", age: 12, phone: 32132},
        {id: 12, name: "asdas", surname: "dsa", age: 12, phone: 32132},
        {id: 13, name: "asdas", surname: "dsa", age: 12, phone: 32132},
        {id: 14, name: "asdas", surname: "dsa", age: 12, phone: 32132},
        {id: 15, name: "asdas", surname: "dsa", age: 12, phone: 32132},
    ],
    parentsChild: [
        {id: 1, name: "asdas", surname: "dsa", age: 12, phone: 32132},
        {id: 12, name: "asdas", surname: "dsa", age: 12, phone: 32132},
        {id: 13, name: "asdas", surname: "dsa", age: 12, phone: 32132},
        {id: 14, name: "asdas", surname: "dsa", age: 12, phone: 32132},
        {id: 15, name: "asdas", surname: "dsa", age: 12, phone: 32132},
    ],
    parentInfo: {
        name: "sardor",
        surname: "ikromov",
        username: "ikromovvv",
        phone: 123123,
        date: "2007.11.02",
        address: "chorvoq"
    },

    loading: true,
    error: null
}


const parentsProfileSlice = createSlice({
    name: "parentsProfileSlice",
    initialState,
    reducers: {
        onDeleteChild: (state, action) => {
            state.parentsChild = state.parentsChild.filter(item => item.id !== action.payload)
        },
        onEditUser: (state,  action) => {
            state.parentInfo = action.payload
        },
        onAddParentChild: (state , action) => {
            state.parentsChild = action.payload
        }


    },
    extraReducers: builder => builder
        .addCase(fetchParentInfo.pending , state => {
            state.loading = true
        })
        .addCase(fetchParentInfo.fulfilled , (state , action) => {
            state.loading = false
            state.parentInfo = action.payload.user
            state.parentsChild = action.payload.children
        })
        .addCase(fetchParentInfo.rejected , state => {
            state.error = false
            state.loading = false

        })
        .addCase(fetchParentsAvailableStudents.pending , state => {
            state.loading = true
        })
        .addCase(fetchParentsAvailableStudents.fulfilled , (state , action) => {
            state.loading = false
            state.children = action.payload
        })
        .addCase(fetchParentsAvailableStudents.rejected , state => {
            state.error = false
            state.loading = false

        })
})

export const {onDeleteChild , onEditUser , onAddParentChild} = parentsProfileSlice.actions
export const {reducer: parentsProfileReducer} = parentsProfileSlice


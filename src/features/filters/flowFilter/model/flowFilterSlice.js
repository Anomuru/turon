import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    subjectId: null,
    teacherId: null,
    isDelete: false
}

const flowFilterSlice = createSlice({
    name: "flowFilterSlice",
    initialState,
    reducers: {
        getSubjectId: (state, action) => {
            state.subjectId = action.payload
        },
        getTeacherId: (state, action) => {
            state.teacherId = action.payload
        },
        getIsDelete: (state, action) => {
            state.isDelete = action.payload
        }
    }
})

export default flowFilterSlice.reducer
export const {
    getSubjectId,
    getTeacherId,
    getIsDelete
} = flowFilterSlice.actions


import {createSlice} from "@reduxjs/toolkit"


const initialState = {
    attendance: [],
    loading: false,
    error: false
}
const groupAttendance = createSlice({
    name: "groupAttendance",
    initialState,
    reducers: {},
    extraReducers: builder => {

    }
})

export default groupAttendance.reducer
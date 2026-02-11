import {createSlice} from "@reduxjs/toolkit";

const initialState = {

    alert: [],


    loading: false,
    error: null
}

const AlertSlice = createSlice({
    name: "alertSlice",
    initialState,
    reducers: {

        onAddAlertOptions: (state,action) => {
            state.alert = [action.payload]
        },
        onAddMultipleAlertOptions: (state,action) => {
            state.alert = action.payload
        },
        onDeleteAlert: (state,action) => {
            state.alert = state.alert.map((item,index) => {
                if (index === action.payload.index) {
                    return {
                        ...item,
                        status: false
                    }
                }
                return item
            })
        }
    },
})


export const {reducer : AlertReducer} = AlertSlice

// export default AlertSlice.reducer
export const {onAddAlertOptions,onAddMultipleAlertOptions,onDeleteAlert} = AlertSlice.actions

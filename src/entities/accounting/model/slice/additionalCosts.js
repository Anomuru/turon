import {createSlice} from "@reduxjs/toolkit";
import {getMonthDay, getOverheadType, overHeadDeletedList, overHeadList} from "../thunk/additionalCosts";

const initialState = {
    overHeadList: [],
    overHeadDeletedLists: [],
    overHeadType: [],
    loading: false,
    error: false,
    monthDay: []
}

export const overHeadSlice = createSlice({
    name: "overHeadSlice",
    initialState,
    reducers: {
        onDeleteOverhead: (state, action) => {
            state.overHeadList = state.overHeadList.filter(item => item.id !== action.payload.id)
        },
        onAddOverhead: (state, action) => {
            state.overHeadList = [...state.overHeadList, action.payload]
        },

        onChangePaymentType: (state, action) => {
            console.log(action.payload)
            state.overHeadList = state.overHeadList.map(item => {
                if (item.id === +action.payload.id) {
                    console.log(item.id, action.payload.id, " item")
                    // return {
                    //     id: action.payload.id ,
                    //     payment_types: action.payload.payment_types,
                    //     user: action.payload.changingData.item.user,
                    //     user_salary: action.payload.changingData.item.user_salary
                    // }
                }
                return item
            })
        }
    },
    extraReducers: builder =>
        builder
            .addCase(overHeadList.pending, state => {
                state.loading = true
                state.error = false
            })
            .addCase(overHeadList.fulfilled, (state, action) => {
                state.overHeadList = action.payload
                state.loading = false
                state.error = false
            })
            .addCase(overHeadList.rejected, state => {
                state.loading = false
                state.error = true
            })



            .addCase(overHeadDeletedList.pending, state => {
                state.loading = true
                state.error = false
            })
            .addCase(overHeadDeletedList.fulfilled, (state, action) => {
                state.overHeadDeletedLists = action.payload
                state.loading = false
                state.error = false
            })


            .addCase(overHeadDeletedList.rejected, state => {
                state.loading = false
                state.error = true
            })


            .addCase(getOverheadType.pending, state => {
                state.loading = true
                state.error = false
            })
            .addCase(getOverheadType.fulfilled, (state, action) => {
                state.overHeadType = action.payload
                state.loading = false
                state.error = false
            })
            .addCase(getOverheadType.rejected, state => {
                state.loading = false
                state.error = true
            })


            .addCase(getMonthDay.pending, state => {
                state.loading = true
                state.error = false
            })
            .addCase(getMonthDay.fulfilled, (state, action) => {
                state.monthDay = action.payload
                state.loading = false
                state.error = false
            })
            .addCase(getMonthDay.rejected, state => {
                state.loading = false
                state.error = true
            })
})

export const {onDeleteOverhead, onChangePaymentType , onAddOverhead} = overHeadSlice.actions
export default overHeadSlice.reducer
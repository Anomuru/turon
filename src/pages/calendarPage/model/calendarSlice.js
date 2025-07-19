import {createSlice} from "@reduxjs/toolkit";
import {fetchCalendarData} from "./calendarThunk";
import {useDispatch} from "react-redux";
import {addRoom} from "../../roomsPage/model/roomsAddSlice";


const initialState = {
    data: null,
    loading: false,
    innerLoading: false,
    error: null
}

const calendarSlice = createSlice({
    name: "calendarSlice",
    initialState,
    reducers: {
        changeDayType: (state, action) => {
            function compareById(a, b) {
                return a.id - b.id;
            }


            state.data = state.data.map(item => ({
                year: item.year,
                months: item.months.map(i => ({
                    month_number: i.month_number,
                    month_name: i.month_name,
                    days: i.days.map(inner => {
                        if (action.payload.filter(iI => iI.id === inner.id)[0]) {
                            return {
                                id: action.payload.filter(iI => iI.id === inner.id)[0]?.id,
                                day_number: action.payload.filter(iI => iI.id === inner.id)[0]?.day_number,
                                day_name: action.payload.filter(iI => iI.id === inner.id)[0]?.day_name,
                                type_id: {
                                    type: action.payload.filter(iI => iI.id === inner.id)[0]?.type_name,
                                    color: action.payload.filter(iI => iI.id === inner.id)[0]?.type_color
                                }
                            }
                        } else return inner
                    }).sort(compareById),
                    types: action.payload[0]?.month === i.month_number ?
                        [
                            ...i.types.map(inner => {
                                return {
                                    color: inner.color,
                                    type: inner.type,
                                    days: inner.days.map(iI => action.payload.sort(compareById).filter(ii => iI.id === ii.id)[0] ? null : iI)
                                        .filter(iI => iI)
                                }
                            }),
                            {
                                type: action.payload[0]?.type_name,
                                color: action.payload[0]?.type_color,
                                days: action.payload
                            }
                        ]
                        : i.types
                }))
            }))
        },
        deleteDayType: (state, action) => {
            function compareById(a, b) {
                return a.id - b.id;
            }

            state.data = state.data.map(item => ({
                year: item.year,
                months: item.months.map(i => ({
                    month_number: i.month_number,
                    month_name: i.month_name,
                    days: i.days.map(inner => {
                        if (action.payload.filter(iI => iI.id === inner.id)[0]) {
                            return {
                                id: action.payload.filter(iI => iI.id === inner.id)[0]?.id,
                                day_number: action.payload.filter(iI => iI.id === inner.id)[0]?.day_number,
                                day_name: action.payload.filter(iI => iI.id === inner.id)[0]?.day_name,
                                type_id: {
                                    type: action.payload.filter(iI => iI.id === inner.id)[0]?.type_name,
                                    color: action.payload.filter(iI => iI.id === inner.id)[0]?.type_color
                                }
                            }
                        } else return inner
                    }),
                    types: i.types.map(item => {
                        if (
                            action.payload.filter(ii =>
                                ii.type_name === item.type &&
                                item.days.filter(iI => ii.id === iI.id)[0]
                            )[0]
                        ) {
                            return {
                                color: item.color,
                                type: item.type,
                                days: [action.payload.filter(ii => ii.type_name === item.type)[0], ...item.days].sort(compareById)
                            }
                        } else return {
                            color: item.color,
                            type: item.type,
                            days: item.days.map(iI => {
                                if (action.payload.filter(ii => ii.id === iI.id)[0]) {
                                    return null
                                } else return iI
                            }).filter(item => item)
                        }
                    })
                }))
            }))
        }
    },
    extraReducers: builder =>
        builder
            .addCase(fetchCalendarData.pending, state => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchCalendarData.fulfilled, (state, action) => {
                state.data = action.payload?.calendar
                state.loading = false
                state.error = null
            })
            .addCase(fetchCalendarData.rejected, (state, action) => {
                state.loading = false
                state.error = "error"
            })
    // .addCase(changeDayType.pending, state => {
    //     state.innerLoading = true
    //     state.error = null
    // })
    // .addCase(changeDayType.fulfilled, (state, action) => {
    //
    //     state.innerLoading = false
    //     state.error = null
    // })
    // .addCase(changeDayType.rejected, (state, action) => {
    //     state.innerLoading = false
    //     state.error = action.payload ?? null
    // })
    // .addCase(deleteDayType.pending, state => {
    //     state.innerLoading = true
    //     state.error = null
    // })
    // .addCase(deleteDayType.fulfilled, (state, action) => {
    //
    //     state.innerLoading = false
    //     state.error = null
    // })
    // .addCase(deleteDayType.rejected, (state, action) => {
    //     state.innerLoading = false
    //     state.error = action.payload ?? null
    // })
})

export const {
    changeDayType,
    deleteDayType
} = calendarSlice.actions
export default calendarSlice.reducer


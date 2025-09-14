import {createSlice} from "@reduxjs/toolkit";
import {fetchStatistics} from "entities/statistics/model/statisticsThunk.js";

const initialState = {
    data: [{
        "expenses": 0,
        "joined_students": {
            "count": 1,
            "items": [
                {
                    "amount": 382143,
                    "date": "12.09.2025",
                    "id": 16704,
                    "name": "Kamilla",
                    "payment_type": "click",
                    "reason": "Iyul salary",
                    "surname": "x",
                    "type_name": "Teacher salaries"
                }
            ]
        },
        "new_groups": {
            "count": 1,
            "items": [
                {
                    "amount": 382143,
                    "date": "12.09.2025",
                    "id": 16704,
                    "name": "Kamilla",
                    "payment_type": "click",
                    "reason": "Iyul salary",
                    "surname": "x",
                    "type_name": "Teacher salaries"
                }
            ]
        },
        "new_leads": {
            "count": 1,
            "items": [
                {
                    "amount": 382143,
                    "date": "12.09.2025",
                    "id": 16704,
                    "name": "Kamilla",
                    "payment_type": "click",
                    "reason": "Iyul salary",
                    "surname": "x",
                    "type_name": "Teacher salaries"
                }
            ]
        },
        "new_students": {
            "count": 1,
            "items": [
                {
                    "amount": 382143,
                    "date": "12.09.2025",
                    "id": 16704,
                    "name": "Kamilla",
                    "payment_type": "click",
                    "reason": "Iyul salary",
                    "surname": "x",
                    "type_name": "Teacher salaries"
                }
            ]
        },
        "overall": 0,
        "overheads": {
            "count": 1,
            "items": [
                {
                    "amount": 382143,
                    "date": "12.09.2025",
                    "id": 16704,
                    "name": "Kamilla",
                    "payment_type": "click",
                    "reason": "Iyul salary",
                    "surname": "x",
                    "type_name": "Teacher salaries"
                }
            ],
            "sum": 382143
        },
        "payments": {
            "count": 1,
            "items": [
                {
                    "amount": 382143,
                    "date": "12.09.2025",
                    "id": 16704,
                    "name": "Kamilla",
                    "payment_type": "click",
                    "reason": "Iyul salary",
                    "surname": "x",
                    "type_name": "Teacher salaries"
                }
            ],
            "sum": 382143
        },
        "staff_salaries": {
            "count": 1,
            "items": [
                {
                    "amount": 382143,
                    "date": "12.09.2025",
                    "id": 16704,
                    "name": "Kamilla",
                    "payment_type": "click",
                    "reason": "Iyul salary",
                    "surname": "x",
                    "type_name": "Teacher salaries"
                }
            ],
            "sum": 382143
        },
        "teacher_salaries": {
            "count": 1,
            "items": [
                {
                    "amount": 382143,
                    "date": "12.09.2025",
                    "id": 16704,
                    "name": "Kamilla",
                    "payment_type": "click",
                    "reason": "Iyul salary",
                    "surname": "x",
                    "type_name": "Teacher salaries"
                }
            ],
            "sum": 382143
        }
    }
    ],
    loading: false,
    error: false
}

export const statisticsSlice = createSlice({
    name: "statisticsSlice",
    initialState,
    reducers: {},
    extraReducers: builder =>
        builder
            .addCase(fetchStatistics.pending ,state => {
                state.loading = true
                state.error = false
            })

            .addCase(fetchStatistics.fulfilled ,(state , action) => {
                state.loading = false
                state.data = action.payload
                state.error = false
            })
            .addCase(fetchStatistics.rejected ,state => {
                state.loading = false
                state.error = true
            })
})


export const {reducer: statisticsReducer} = statisticsSlice
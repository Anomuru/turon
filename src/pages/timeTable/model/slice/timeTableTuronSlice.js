import {createSlice} from "@reduxjs/toolkit";
import {fetchTeacherProfileData} from "pages/profilePage/model/thunk/teacherProfile.thunk";
import {
    fetchTimeTableClassView,
    fetchTimeTableColors,
    fetchTimeTableData, fetchTimeTableForShow, fetchTimeTableSubject, fetchTimeTableTeacher,
    fetchTimeTableTypesData,
    fetchTimeTableWeekDays
} from "pages/timeTable/model/thunks/timeTableTuronThunks";

const initialState = {


    type: 'group',
    hours: [],
    data: [],
    forShow: [],
    group: [],
    flows: [],
    subjects: [],
    teachers: [],
    weekDays: [],
    colors: [],
    date: new Date().toLocaleDateString('en-CA'),

    classViewData: [],

    isDataStatus: "date",
    selectedDay: null,
    weekDay: null,
    day: "",
    color: "",
    filterClass: "",
    filterTeacher: "",

    fetchStatusTeachers: "idle",
    fetchStatusGroup: "idle",
    fetchStatusData: false,
    loading: false,
    error: null
}

const timeTableTuronSlice = createSlice({
    name: "TimeTableTuronSlice",
    initialState,
    reducers: {
        onChangeTypeTimeTable: (state, action) => {
            state.type = action.payload
        },

        onChangeDayTimeTable: (state, action) => {
            state.day = action.payload
        },

        onChangeFilterClassTimeTable: (state, action) => {
            state.filterClass = action.payload
        },

        onChangeFilterTeacherTimeTable: (state, action) => {
            state.filterTeacher = action.payload
        },

        onChangeColorTimeTable: (state, action) => {
            state.color = action.payload
        },

        onChangeDateTimeTable: (state, action) => {
            state.date = action.payload
            state.isDataStatus = "date"
            localStorage.setItem("dateForTimeTable", JSON.stringify({type: "date", value: action.payload}))
            // state.weekDay = null
        },
        onChangeWeekDayTimeTable: (state, action) => {
            state.weekDay = action.payload
            state.isDataStatus = "week"
            localStorage.setItem("dateForTimeTable", JSON.stringify({type: "week", value: action.payload}))
        }
    },
    extraReducers: builder =>
        builder
            .addCase(fetchTimeTableColors.pending, state => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchTimeTableColors.fulfilled, (state, action) => {
                state.colors = action.payload
                state.color = action.payload[0].id
                state.loading = false
                state.error = null
            })
            .addCase(fetchTimeTableColors.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload ?? null
            })


            .addCase(fetchTimeTableSubject.pending, state => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchTimeTableSubject.fulfilled, (state, action) => {
                if (action.payload.length > 0) {
                    state.subjects = action.payload.map((item, index) => {
                        return {
                            ...item,
                            dndId: `subject-${item.id}`,
                            type: "subject"
                        }
                    })
                } else {

                    state.subjects = []
                }

                state.loading = false
                state.error = null
            })
            .addCase(fetchTimeTableSubject.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload ?? null
            })


            .addCase(fetchTimeTableTeacher.pending, state => {
                state.loading = true
                state.error = null
                state.fetchStatusTeachers = "loading"
            })


            .addCase(fetchTimeTableTeacher.fulfilled, (state, action) => {


                state.teachers = action.payload?.map((item, index) => {
                    return {
                        ...item,
                        dndId: `teacher-${item.id}`,
                        type: "teacher"
                    }
                })


                state.fetchStatusTeachers = "success"


                state.loading = false
                state.error = null
            })


            .addCase(fetchTimeTableTeacher.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload ?? null
                state.fetchStatusTeachers = "error"
            })


            .addCase(fetchTimeTableWeekDays.pending, state => {
                state.loading = true
                state.error = null
            })

            .addCase(fetchTimeTableWeekDays.fulfilled, (state, action) => {
                state.weekDays = action.payload.days.map(item => {
                    return {
                        id: item.id,
                        name: item.name_uz
                    }
                })
                state.day = action.payload.today
                state.loading = false
                state.error = null
            })
            .addCase(fetchTimeTableWeekDays.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload ?? null
            })


            .addCase(fetchTimeTableTypesData.pending, state => {
                state.loading = true
                state.error = null
                state.fetchStatusGroup = "loading"
            })


            .addCase(fetchTimeTableTypesData.fulfilled, (state, action) => {
                state.group = action.payload?.map((item, index) => {
                    return {
                        ...item,
                        dndId: `${item.type}-${item.id}`,
                        type: item.type

                    }
                }) || []


                state.fetchStatusGroup = "success"
                state.loading = false
                state.error = null
            })
            .addCase(fetchTimeTableTypesData.rejected, (state, action) => {
                state.loading = false
                state.fetchStatusGroup = "error"

                state.error = action.payload ?? null
            })


            .addCase(fetchTimeTableClassView.pending, state => {
                state.loading = true
                state.error = null
            })


            .addCase(fetchTimeTableClassView.fulfilled, (state, action) => {


                state.classViewData = action.payload.time_tables
                state.loading = false
                state.error = null
            })
            .addCase(fetchTimeTableClassView.rejected, (state, action) => {
                state.loading = false
                state.error = true
            })


            .addCase(fetchTimeTableData.pending, state => {
                state.loading = true
                state.fetchStatusData = true
                state.error = null
            })


            .addCase(fetchTimeTableData.fulfilled, (state, action) => {

                let indexContainer = 1


                state.data = action.payload.time_tables[0]?.rooms?.map(room => {

                    const newLessons = room.lessons.map(item => {
                        indexContainer += 1


                        if (item.group.id) {
                            return {
                                ...item,

                                group: {
                                    ...item.group,
                                    dndId: `group-${item.id}`,
                                    type: item.is_flow ? "flow" : "group"
                                },
                                subject: {
                                    ...item.subject,
                                    dndId: `subject-${item.id}`,
                                    type: `subject`
                                },
                                teacher: {
                                    ...item.teacher,
                                    dndId: `teacher-${item.id}`,
                                    type: `teacher`
                                },
                                dndId: `container-${indexContainer}`,
                                isSelected: false,
                                isDisabled: false
                            }
                        }


                        return {
                            ...item,
                            dndId: `container-${indexContainer}`,
                            isSelected: false,
                            isDisabled: false
                        }
                    })


                    return {
                        ...room,
                        lessons: newLessons

                    }
                })

                state.hours = action.payload.hours_list
                state.fetchStatusData = false

                state.loading = false
                state.error = null
            })
            .addCase(fetchTimeTableData.rejected, (state, action) => {
                state.loading = false
                state.fetchStatusData = false

                state.error = action.payload ?? null
            })

            .addCase(fetchTimeTableForShow.pending, state => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchTimeTableForShow.fulfilled, (state, action) => {
                state.loading = false
                state.forShow = action.payload
                state.error = null
            })
            .addCase(fetchTimeTableForShow.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload ?? null
            })
})

export const {reducer: timeTableTuronReducer} = timeTableTuronSlice

// export default TimeTableTuronSlice.reducer
export const {
    onChangeTypeTimeTable,
    onChangeDayTimeTable,
    onChangeColorTimeTable,
    onChangeFilterClassTimeTable,
    onChangeFilterTeacherTimeTable,
    onChangeDateTimeTable,
    onChangeWeekDayTimeTable
} = timeTableTuronSlice.actions

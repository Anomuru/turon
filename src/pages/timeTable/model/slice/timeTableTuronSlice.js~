import {createSlice} from "@reduxjs/toolkit";
import {fetchTeacherProfileData} from "pages/profilePage/model/thunk/teacherProfile.thunk";
import {
    fetchTimeTableClassHours,
    fetchTimeTableClassView,
    fetchTimeTableColors,
    fetchTimeTableData, fetchTimeTableSubject, fetchTimeTableTeacher,
    fetchTimeTableTypesData,
    fetchTimeTableWeekDays
} from "pages/timeTable/model/thunks/timeTableTuronThunks";

const initialState = {


    type: 'group',
    hours: [],
    data: [],
    group: [],
    flows: [],
    subjects: [],
    teachers: [],
    weekDays: [],
    colors: [],
    date: new Date().toLocaleDateString('en-CA'),

    classViewData: [],

    day: "",
    color: "",
    filterClass: "",

    fetchStatusTeachers: "idle",
    fetchStatusGroup: "idle",
    fetchStatusData: "idle",
    loading: false,
    error: null
}

const TimeTableTuronSlice = createSlice({
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

        onChangeColorTimeTable: (state, action) => {
            state.color = action.payload
        },

        onChangeDateTimeTable: (state, action) => {
            state.date = action.payload
        },
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


                state.teachers = action.payload.map((item, index) => {
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
                state.group = action.payload.map((item, index) => {
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
                state.fetchStatusData = "loading"
                state.error = null
            })


            .addCase(fetchTimeTableData.fulfilled, (state, action) => {

                let indexContainer = 1


                state.data = action.payload.time_tables.map(room => {

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
                state.fetchStatusData = "success"

                state.loading = false
                state.error = null
            })
            .addCase(fetchTimeTableData.rejected, (state, action) => {
                state.loading = false
                state.fetchStatusData = "error"

                state.error = action.payload ?? null
            })
})

export default TimeTableTuronSlice.reducer
export const {
    onChangeTypeTimeTable,
    onChangeDayTimeTable,
    onChangeColorTimeTable,
    onChangeFilterClassTimeTable,
    onChangeDateTimeTable
} = TimeTableTuronSlice.actions
